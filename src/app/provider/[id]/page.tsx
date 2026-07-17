import { createClient } from "@/lib/supabase/server";
import ProviderProfileClient from "@/components/provider/ProviderProfileClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("full_name, business_name").eq("id", id).single();
  const name = data?.business_name || data?.full_name || "Provider";
  return {
    title: name + " | GetServiHub",
    description: "View " + name + "'s profile, services, and work on GetServiHub.",
  };
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
    return (
      <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <div className="text-muted2 text-sm">Provider not found.</div>
      </main>
    );
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

  return (
    <ProviderProfileClient
      profile={profile}
      services={(services as any) || []}
      posts={posts || []}
      avgRating={avgRating}
      reviewCount={reviewCount}
    />
  );
}
