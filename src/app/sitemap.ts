import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE_URL = "https://www.getservihub.com";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/find`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/gallery`, changeFrequency: "daily", priority: 0.6 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/trust-safety`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/community-guidelines`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/gateway`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const { data: services } = await supabase
    .from("services")
    .select("id, updated_at, provider_id")
    .eq("is_active", true);

  const serviceRoutes: MetadataRoute.Sitemap = (services || []).map((s) => ({
    url: `${BASE_URL}/service/${s.id}`,
    lastModified: s.updated_at ? new Date(s.updated_at) : undefined,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const providerIds = Array.from(
    new Set((services || []).map((s) => s.provider_id).filter(Boolean))
  );

  const providerRoutes: MetadataRoute.Sitemap = providerIds.flatMap((id) => ([
    { url: `${BASE_URL}/provider/${id}`, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE_URL}/provider/${id}/gallery`, changeFrequency: "weekly" as const, priority: 0.5 },
    { url: `${BASE_URL}/provider/${id}/reviews`, changeFrequency: "weekly" as const, priority: 0.5 },
  ]));

  return [...staticRoutes, ...serviceRoutes, ...providerRoutes];
}
