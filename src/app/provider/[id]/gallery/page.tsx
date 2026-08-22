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
  const title = `${name} — Gallery${data.city ? ` | ${data.city}` : ""} | GetServiHub`;
  const description = `Photos of completed work by ${name}${data.city ? ` in ${data.city}` : ""} on GetServiHub.`;
  return { title, description, openGraph: { title, description } };
}

export default async function ProviderGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("id, image_url, caption")
    .eq("provider_id", id)
    .order("created_at", { ascending: false });

  if (!posts || posts.length === 0) {
    return <div className="text-muted2 text-sm py-10 text-center">No posts yet.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-card border border-white/[.08] rounded-2xl overflow-hidden">
          <div className="w-full h-[240px] flex items-center justify-center bg-gradient-to-br from-[#0A1628] to-[#0D1A2E] overflow-hidden">
            <img src={post.image_url} alt={post.caption || "Work"} className="w-full h-full object-cover" />
          </div>
          {post.caption && (
            <div className="p-4">
              <div className="text-xs text-muted2">{post.caption}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
