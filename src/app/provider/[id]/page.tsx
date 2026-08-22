import { createClient } from "@/lib/supabase/server";
import ServicesGrid from "@/components/provider/ServicesGrid";
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

const SERVICE_SELECT = "id, title, city, image_url, categories(name, icon)";

export default async function ProviderServicesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: services } = await supabase
    .from("services")
    .select(SERVICE_SELECT)
    .eq("provider_id", id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return <ServicesGrid services={(services as any) || []} />;
}
