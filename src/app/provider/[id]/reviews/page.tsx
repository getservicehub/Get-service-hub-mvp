import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("full_name, business_name, city").eq("id", id).single();
  if (!data) {
    return { title: "Provider Not Found | GetServiHub" };
  }
  const name = data.business_name || data.full_name || "Provider";
  const title = `${name} — Reviews${data.city ? ` | ${data.city}` : ""} | GetServiHub`;
  const description = `Read reviews for ${name}${data.city ? ` in ${data.city}` : ""} on GetServiHub.`;
  return { title, description, openGraph: { title, description } };
}

export default async function ProviderReviewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: services } = await supabase
    .from("services")
    .select("id")
    .eq("provider_id", id)
    .eq("is_active", true);

  const serviceIds = (services || []).map((s) => s.id);

  if (serviceIds.length === 0) {
    return <div className="text-muted2 text-sm py-10 text-center">No reviews yet.</div>;
  }

  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, rating, comment, created_at, profiles(full_name)")
    .in("service_id", serviceIds)
    .order("created_at", { ascending: false });

  if (!reviews || reviews.length === 0) {
    return <div className="text-muted2 text-sm py-10 text-center">No reviews yet.</div>;
  }

  return (
    <div className="space-y-3">
      {reviews.map((r: any) => (
        <div key={r.id} className="bg-card border border-white/[.08] rounded-2xl p-4">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center font-extrabold text-white text-sm">
              {r.profiles?.full_name?.[0] || "U"}
            </div>
            <div>
              <div className="text-[13px] font-bold">{r.profiles?.full_name || "User"}</div>
              <div className="text-[11px] text-amber-400">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
            </div>
          </div>
          {r.comment && <p className="text-sm text-muted2">{r.comment}</p>}
        </div>
      ))}
    </div>
  );
}