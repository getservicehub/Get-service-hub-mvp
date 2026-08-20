import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProviderProfileClient from "@/components/provider/ProviderProfileClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("full_name, business_name, city, is_verified").eq("id", id).single();

  if (!data) {
    return { title: "Provider Not Found | GetServiHub" };
  }

  const name = data.business_name || data.full_name || "Provider";
  const title = `${name}${data.city ? ` — ${data.city}` : ""} | GetServiHub`;
  const description = data.is_verified
    ? `${name} is a verified local professional on GetServiHub${data.city ? ` serving ${data.city}` : ""}. View services, reviews, and contact information.`
    : `View ${name}'s profile, services, and work on GetServiHub${data.city ? ` in ${data.city}` : ""}.`;

  return { title, description, openGraph: { title, description } };
}

const SERVICE_SELECT = "id, title, description, city, price_from, emergency, espanol, image_url, plan, categories(name, icon)";

export default async function ProviderProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, business_name, avatar_url, city, phone, is_verified, created_at")
    .eq("id", id)
    .single();

  if (!profile) {
    notFound();
  }

  const { data: services } = await supabase
    .from("services")
    .select(SERVICE_SELECT)
    .eq("provider_id", id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const { data: posts } = await supabase
    .from("posts")
    .select("id, image_url, caption")
    .eq("provider_id", id)
    .order("created_at", { ascending: false });

  const serviceIds = (services || []).map((s: any) => s.id);
  let avgRating: number | null = null;
  let reviewCount = 0;

  if (serviceIds.length > 0) {
    const { data: ratings } = await supabase.from("service_ratings").select("avg_rating, review_count").in("service_id", serviceIds);
    if (ratings && ratings.length > 0) {
      const totalReviews = ratings.reduce((sum, r) => sum + r.review_count, 0);
      const weightedSum = ratings.reduce((sum, r) => sum + r.avg_rating * r.review_count, 0);
      if (totalReviews > 0) {
        avgRating = Math.round((weightedSum / totalReviews) * 10) / 10;
        reviewCount = totalReviews;
      }
    }
  }

  const providerName = profile.business_name || profile.full_name || "Provider";
  const categoryNames = Array.from(
    new Set((services || []).map((s: any) => s.categories?.name).filter(Boolean))
  );

  const localBusinessSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: providerName,
    ...(profile.city && {
      address: { "@type": "PostalAddress", addressLocality: profile.city, addressRegion: "CA" },
    }),
    ...(profile.phone && { telephone: profile.phone }),
    ...(categoryNames.length > 0 && { knowsAbout: categoryNames }),
  };

  if (avgRating && reviewCount > 0) {
    localBusinessSchema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: avgRating,
      reviewCount: reviewCount,
    };
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <ProviderProfileClient
        profile={profile}
        services={(services as any) || []}
        posts={posts || []}
        avgRating={avgRating}
        reviewCount={reviewCount}
      />
    </>
  );
}
