import { unstable_cache } from "next/cache";
import { createPublicClient } from "../../src/lib/supabase/public";
import type { Specialty } from "../../types/pro";
import type { SpecialtyRow } from "../../types/database";

function mapRow(row: SpecialtyRow): Specialty {
  return {
    id: row.id, slug: row.slug, name: row.name,
    shortDescription: row.short_description, categoryId: row.category_id,
    relatedGoalIds: [], icon: row.icon, isActive: row.is_active,
    scopeNote: row.scope_note ?? undefined,
  };
}

export const getSpecialties = unstable_cache(
  async (): Promise<Specialty[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("pro_specialties").select("*").eq("is_active", true).order("name");
    if (error) { console.error("getSpecialties failed:", error.message); return []; }
    return (data as SpecialtyRow[]).map(mapRow);
  },
  ["pro-specialties-all"],
  { revalidate: 300, tags: ["pro-specialties"] }
);

export const getSpecialtyBySlug = unstable_cache(
  async (slug: string): Promise<Specialty | null> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("pro_specialties").select("*").eq("slug", slug).eq("is_active", true).maybeSingle();
    if (error || !data) return null;
    return mapRow(data as SpecialtyRow);
  },
  ["pro-specialty-by-slug"],
  { revalidate: 300, tags: ["pro-specialties"] }
);
