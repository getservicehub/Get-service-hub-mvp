import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { ServiceCard } from "./queries";

const SERVICE_SELECT =
  "id, title, description, city, price_from, emergency, espanol, image_url, provider_id, plan, profiles(full_name, business_name, phone, is_verified), categories(name, icon)";

export const getServiceByIdServer = cache(async (id: string): Promise<ServiceCard | null> => {
  const supabase = await createClient();
  const { data } = await supabase.from("services").select(SERVICE_SELECT).eq("id", id).single();
  return (data as unknown as ServiceCard) || null;
});

export type ReviewRow = {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  client_id: string;
  profiles: { full_name: string } | null;
};

export const getServiceReviewsServer = cache(async (serviceId: string): Promise<ReviewRow[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("id, rating, comment, created_at, client_id, profiles(full_name)")
    .eq("service_id", serviceId)
    .order("created_at", { ascending: false });
  return (data as unknown as ReviewRow[]) || [];
});
