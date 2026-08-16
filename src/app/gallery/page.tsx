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
    .select("id, image_url, caption, provider_id, service_id, created_at, profiles(full_name, business_name, phone, avatar_url)")
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

  const serviceIds = Array.from(new Set((posts || []).map((p: any) => p.service_id).filter(Boolean)));
  let servicesById: Record<string, any> = {};

  if (serviceIds.length > 0) {
    const { data: services } = await supabase
      .from("services")
      .select("id, title, price_from, city, categories(name)")
      .in("id", serviceIds);

    if (services) {
      for (const svc of services) {
        servicesById[svc.id] = svc;
      }
    }
  }

  const postsWithImages = (posts || []).map((p: any) => ({
    ...p,
    extraImages: imagesByPost[p.id] || [],
    service: p.service_id ? servicesById[p.service_id] || null : null,
  }));

  return <GalleryClient posts={postsWithImages} />;
}
