import { createPublicClient } from "../../src/lib/supabase/public";
import type { Professional } from "../../types/pro";
import type { ProfessionalRow, ProfessionalStatsRow } from "../../types/database";

export type MaybeDemoProfessional = Professional & { isDemo: boolean };

function mapRow(row: ProfessionalRow, specialtyIds: string[]): MaybeDemoProfessional {
  return {
    id: row.id,
    slug: row.slug,
    displayName: row.display_name,
    profession: row.profession,
    specialtyIds,
    city: row.city,
    state: row.state,
    languages: row.languages,
    bio: row.bio,
    avatarUrl: row.avatar_url ?? undefined,
    yearsExperience:
      row.years_experience_value != null && row.years_experience_source
        ? { value: row.years_experience_value, source: row.years_experience_source }
        : undefined,
    verification: { identity: row.identity_verification, license: row.license_verification },
    availabilityStatus: row.availability_status ?? undefined,
    joinedAt: row.joined_at,
    isDemo: row.is_demo,
  };
}

async function getSpecialtyIdsByProfessional(
  professionalIds: string[]
): Promise<Record<string, string[]>> {
  if (professionalIds.length === 0) return {};
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("pro_professional_specialties")
    .select("professional_id, specialty_id")
    .in("professional_id", professionalIds);

  if (error || !data) return {};
  const map: Record<string, string[]> = {};
  for (const row of data as { professional_id: string; specialty_id: string }[]) {
    if (!map[row.professional_id]) map[row.professional_id] = [];
    map[row.professional_id].push(row.specialty_id);
  }
  return map;
}

export async function getAllProfessionals(): Promise<MaybeDemoProfessional[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("pro_professionals")
    .select("*")
    .eq("is_published", true)
    .order("display_name");

  if (error || !data) return [];
  const rows = data as ProfessionalRow[];
  const specialtyMap = await getSpecialtyIdsByProfessional(rows.map((r) => r.id));
  return rows.map((row) => mapRow(row, specialtyMap[row.id] ?? []));
}

export async function getProfessionalsBySpecialty(
  specialtyId: string
): Promise<MaybeDemoProfessional[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("pro_professional_specialties")
    .select("professional_id")
    .eq("specialty_id", specialtyId);

  if (error || !data || data.length === 0) return [];
  const ids = (data as { professional_id: string }[]).map((r) => r.professional_id);

  const { data: profRows, error: profError } = await supabase
    .from("pro_professionals")
    .select("*")
    .in("id", ids)
    .eq("is_published", true)
    .order("display_name");

  if (profError || !profRows) return [];
  const rows = profRows as ProfessionalRow[];
  const specialtyMap = await getSpecialtyIdsByProfessional(rows.map((r) => r.id));
  return rows.map((row) => mapRow(row, specialtyMap[row.id] ?? []));
}

export async function getProfessionalBySlug(
  slug: string
): Promise<MaybeDemoProfessional | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("pro_professionals")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) return null;
  const row = data as ProfessionalRow;
  const specialtyMap = await getSpecialtyIdsByProfessional([row.id]);
  return mapRow(row, specialtyMap[row.id] ?? []);
}

export async function getProfessionalStats(
  professionalId: string
): Promise<ProfessionalStatsRow | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("pro_professional_stats")
    .select("*")
    .eq("professional_id", professionalId)
    .maybeSingle();

  if (error || !data) return null;
  return data as ProfessionalStatsRow;
}
