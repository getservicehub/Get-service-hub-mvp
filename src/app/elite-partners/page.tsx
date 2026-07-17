import { createClient } from "@/lib/supabase/server";
import EliteClient from "@/components/elite-partners/EliteClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Elite Partners | GetServiHub",
  description: "Meet San Diego's Elite Partners - our most exclusive, top-tier service professionals. Only 5 spots available.",
};

const SERVICE_SELECT =
  "id, title, description, city, price_from, emergency, espanol, image_url, provider_id, plan, profiles(full_name, business_name, phone), categories(name, icon)";

export default async function ElitePartnersPage() {
  const supabase = await createClient();

  const { data: eliteServices } = await supabase
    .from("services")
    .select(SERVICE_SELECT)
    .eq("is_active", true)
    .eq("plan", "premier")
    .order("created_at", { ascending: false });

  const { data: plusServices } = await supabase
    .from("services")
    .select(SERVICE_SELECT)
    .eq("is_active", true)
    .eq("plan", "premium")
    .order("created_at", { ascending: false });

  return <EliteClient eliteServices={(eliteServices as any) || []} plusServices={(plusServices as any) || []} />;
}
