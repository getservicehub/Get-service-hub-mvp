import { createClient } from "@/lib/supabase/server";
import DirectoryClient from "@/components/directory/DirectoryClient";
import type { Metadata } from "next";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Browse All Pros | GetServiHub",
  description: "Find verified local service professionals in San Diego. Mobile mechanics, plumbers, electricians, cleaners, and more. English & Spanish. No commission.",
};

const SERVICE_SELECT =
  "id, title, description, city, price_from, emergency, espanol, image_url, provider_id, plan, profiles(full_name, business_name, phone), categories(name, icon)";

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const initialFilter = params.category || "All";

  const supabase = await createClient();

  const { data: services } = await supabase
    .from("services")
    .select(SERVICE_SELECT)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const { data: categories } = await supabase.from("categories").select("id, name, icon").order("name");

  return (
    <DirectoryClient
      initialServices={(services as any) || []}
      initialCategories={categories || []}
      initialFilter={initialFilter}
    />
  );
}
