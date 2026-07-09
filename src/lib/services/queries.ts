import { createClient } from "@/lib/supabase/client";

export type ServiceCard = {
  id: string;
  title: string;
  description: string;
  city: string;
  price_from: number | null;
  emergency: boolean;
  espanol: boolean;
  image_url: string | null;
  provider_id: string;
  plan: string;
  profiles: { full_name: string; business_name: string; phone: string | null } | null;
  categories: { name: string; icon: string } | null;
};

const SERVICE_SELECT =
  "id, title, description, city, price_from, emergency, espanol, image_url, provider_id, plan, profiles(full_name, business_name, phone), categories(name, icon)";

export async function getActiveServices(): Promise<ServiceCard[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("services")
    .select(SERVICE_SELECT)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (data as unknown as ServiceCard[]) || [];
}

export async function getServiceById(id: string): Promise<ServiceCard | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("services")
    .select(SERVICE_SELECT)
    .eq("id", id)
    .single();

  return (data as unknown as ServiceCard) || null;
}

export function getProviderName(service: ServiceCard): string {
  return service.profiles?.business_name || service.profiles?.full_name || "Provider";
}

export function getContactLinks(service: ServiceCard) {
  const phone = service.profiles?.phone;
  return {
    telLink: phone ? "tel:" + phone.replace(/\D/g, "") : null,
    waLink: phone ? "https://wa.me/1" + phone.replace(/\D/g, "") : null,
  };
}
