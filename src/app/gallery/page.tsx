import { createClient } from "@/lib/supabase/server";
import GalleryClient from "@/components/gallery/GalleryClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Work Gallery | GetServiHub",
  description: "See real work from local San Diego service professionals.",
};

export default async function GalleryPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("id, image_url, caption, provider_id, created_at, profiles(full_name, business_name, phone)")
    .order("created_at", { ascending: false });

  return <GalleryClient posts={(posts as any) || []} />;
}
