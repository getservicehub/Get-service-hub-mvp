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
    .select("id, image_url, caption, provider_id, created_at, profiles(full_name, business_name, phone, avatar_url)")
    .order("created_at", { ascending: false });

  const postIds = (posts || []).map((p: any) => p.id);
  let imagesByPost: Record<string, string[]> = {};

  if (postIds.length > 0) {
    const { data: extraImages } = await supabase
      .from("post_images")
      .select("post_id, image_url, display_order")
      .in("post_id", postIds)
      .order("display_order");

    if (extraImages) {
      for (const img of extraImages) {
        if (!imagesByPost[img.post_id]) imagesByPost[img.post_id] = [];
        imagesByPost[img.post_id].push(img.image_url);
      }
    }
  }

  const postsWithImages = (posts || []).map((p: any) => ({
    ...p,
    extraImages: imagesByPost[p.id] || [],
  }));

  return <GalleryClient posts={postsWithImages} />;
}
