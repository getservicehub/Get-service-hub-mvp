import { createClient } from "@/lib/supabase/server";
import FeaturedClient from "@/components/featured/FeaturedClient";
import { getRotatedWindow } from "@/lib/services/rotation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Featured Professionals | GetServiHub",
  description: "Discover top-rated Premium and Premier professionals in San Diego, verified and ready to help.",
};

const SERVICE_SELECT =
  "id, title, description, city, price_from, emergency, espanol, image_url, provider_id, plan, profiles(full_name, business_name, phone), categories(name, icon)";

export default async function FeaturedPage() {
  const supabase = await createClient();

  const { data: services } = await supabase
    .from("services")
    .select(SERVICE_SELECT)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const premiumOnly = ((services as any) || []).filter((s: any) => s.plan === "premium" || s.plan === "premier");
  const rotated = getRotatedWindow<any>(premiumOnly, 4, 7);

  return <FeaturedClient services={rotated} />;
}
