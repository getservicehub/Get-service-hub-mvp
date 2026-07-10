import { createClient } from "@/lib/supabase/server";
import DiscoverClient from "@/components/discover/DiscoverClient";
import { getRotatedWindow } from "@/lib/services/rotation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Discover Local Pros | GetServiHub",
  description: "Discover local service professionals in San Diego. Follow, like, and connect instantly.",
};

const SERVICE_SELECT =
  "id, title, description, city, price_from, emergency, espanol, image_url, provider_id, plan, profiles(full_name, business_name, phone), categories(name, icon)";

export default async function DiscoverPage() {
  const supabase = await createClient();

  const { data: services } = await supabase
    .from("services")
    .select(SERVICE_SELECT)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const allServices = (services as any) || [];
  const paidPlans = allServices.filter((s: any) => s.plan === "pro" || s.plan === "premium" || s.plan === "premier");
  const sponsored = getRotatedWindow<any>(paidPlans, 4, 1);

  return <DiscoverClient allServices={allServices} sponsored={sponsored} />;
}
