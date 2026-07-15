import { createClient } from "@/lib/supabase/server";
import DirectoryClient from "@/components/find/DirectoryClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Find Local Pros | GetServiHub",
  description: "Find verified local service professionals in San Diego. Mobile mechanics, plumbers, electricians, cleaners, and more. English & Spanish. No commission.",
};

const SERVICE_SELECT =
  "id, title, description, city, price_from, emergency, espanol, image_url, provider_id, plan, profiles(full_name, business_name, phone), categories(name, icon)";

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; city?: string }>;
}) {
  const params = await searchParams;
  const initialFilter = params.category || "All";
  const initialCity = params.city || "";

  const supabase = await createClient();

  const { data: services } = await supabase
    .from("services")
    .select(SERVICE_SELECT)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const { data: categories } = await supabase.from("categories").select("id, name, icon").order("name");
  const { data: ratings } = await supabase.from("service_ratings").select("service_id, avg_rating, review_count");

  const allServices = ((services as any) || []).map((s: any) => {
    const rating = ratings?.find((r) => r.service_id === s.id);
    return {
      ...s,
      avg_rating: rating?.avg_rating || null,
      review_count: rating?.review_count || 0,
    };
  });

  const cities = Array.from(new Set(allServices.map((s: any) => s.city).filter(Boolean))).sort() as string[];

  return (
    <DirectoryClient
      initialServices={allServices}
      initialCategories={categories || []}
      initialFilter={initialFilter}
      initialCity={initialCity}
      cities={cities}
    />
  );
}
