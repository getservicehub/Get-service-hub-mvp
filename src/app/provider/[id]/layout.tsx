import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import StarRating from "@/components/ui/StarRating";
import FollowButtons from "@/components/provider/FollowButtons";
import TabNav from "@/components/provider/TabNav";

export default async function ProviderLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
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
    .select("id, categories(name)")
    .eq("provider_id", id)
    .eq("is_active", true);

  const serviceIds = (services || []).map((s: any) => s.id);
  let avgRating: number | null = null;
  let reviewCount = 0;

  if (serviceIds.length > 0) {
    const { data: ratings } = await supabase
      .from("service_ratings")
      .select("avg_rating, review_count")
      .in("service_id", serviceIds);
    if (ratings && ratings.length > 0) {
      const totalReviews = ratings.reduce((sum, r) => sum + r.review_count, 0);
      const weightedSum = ratings.reduce((sum, r) => sum + r.avg_rating * r.review_count, 0);
      if (totalReviews > 0) {
        avgRating = Math.round((weightedSum / totalReviews) * 10) / 10;
        reviewCount = totalReviews;
      }
    }
  }

  const name = profile.business_name || profile.full_name || "Provider";
  const categoryNames = Array.from(
    new Set((services || []).map((s: any) => s.categories?.name).filter(Boolean))
  );
  const memberSince = new Date(profile.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long" });

  const localBusinessSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
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
      reviewCount,
    };
  }

  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <div className="max-w-[900px] mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5 mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-card border-2 border-white/10 flex items-center justify-center text-3xl flex-shrink-0">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span>{name[0]}</span>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-2xl font-extrabold">{name}</h1>
              {profile.is_verified && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-bold">✓ Verified</span>
              )}
            </div>
            <div className="text-sm text-muted2 mb-2">
              {profile.city} - Member since {memberSince}
            </div>

            {avgRating && (
              <div className="flex items-center gap-1.5 mb-3">
                <StarRating rating={avgRating} size="text-sm" />
                <span className="text-xs text-muted2">{avgRating} ({reviewCount} reviews)</span>
              </div>
            )}

            <FollowButtons providerId={profile.id} phone={profile.phone} />
          </div>
        </div>

        <TabNav providerId={profile.id} />

        {children}
      </div>
    </main>
  );
}
