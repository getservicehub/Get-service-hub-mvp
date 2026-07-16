import { createClient } from "@/lib/supabase/server";
import PremierPartnersClient from "@/components/premier-partners/PremierPartnersClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Premier Partners | GetServiHub",
  description: "Meet San Diego's Premier Partners - our most exclusive, top-tier service professionals. Only 3 spots available.",
};

const SERVICE_SELECT =
  "id, title, description, city, price_from, emergency, espanol, image_url, provider_id, plan, profiles(full_name, business_name, phone), categories(name, icon)";

export default async function PremierPartnersPage() {
  const supabase = await createClient();

  const { data: services } = await supabase
    .from("services")
    .select(SERVICE_SELECT)
    .eq("is_active", true)
    .eq("plan", "premier")
    .order("created_at", { ascending: false });

  return <PremierPartnersClient services={(services as any) || []} />;
}
