import { createClient } from "@/lib/supabase/client";

type EventType =
  | "impression"
  | "click"
  | "contact_call"
  | "contact_whatsapp"
  | "favorite_add"
  | "favorite_remove"
  | "review_submit";

export async function trackEvent(
  eventType: EventType,
  serviceId: string | null,
  metadata?: Record<string, unknown>
) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  await supabase.from("events").insert({
    event_type: eventType,
    service_id: serviceId,
    user_id: user?.id ?? null,
    metadata: metadata ?? null,
  });
}
