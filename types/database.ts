export type SpecialtyRow = {
  id: string; slug: string; name: string; short_description: string;
  category_id: "licensed" | "portfolio"; icon: string; scope_note: string | null;
  is_active: boolean; created_at: string;
};

export type ProfessionalRow = {
  id: string; slug: string; display_name: string; profession: string;
  city: string; state: string; languages: string[]; bio: string;
  avatar_url: string | null; years_experience_value: number | null;
  years_experience_source: "self_reported" | "document_verified" | null;
  identity_verification: "pending" | "verified" | "rejected";
  license_verification: "not_required" | "pending" | "verified" | "rejected";
  availability_status: "available" | "limited" | "unavailable" | null;
  is_demo: boolean; is_published: boolean; joined_at: string;
};

export type ProfessionalStatsRow = {
  professional_id: string; completed_jobs: number;
  verified_service_reviews: number; professional_references: number;
  imported_external_reviews: number; unverified_comments: number;
};
