export type ReviewStats = {
  verifiedServiceReviews: number;
  professionalReferences: number;
  importedExternalReviews: number;
  unverifiedComments: number;
};

export type VerificationStatus = "pending" | "verified" | "rejected";

export type DeclaredOrVerified<T> = {
  value: T;
  source: "self_reported" | "document_verified";
};

export type Professional = {
  id: string;
  slug: string;
  displayName: string;
  profession: string;
  specialtyIds: string[];
  city: string;
  state: string;
  languages: string[];
  bio: string;
  avatarUrl?: string;
  yearsExperience?: DeclaredOrVerified<number>;
  verification: {
    identity: VerificationStatus;
    license: "not_required" | VerificationStatus;
  };
  availabilityStatus?: "available" | "limited" | "unavailable";
  joinedAt: string;
  stats?: {
    completedJobs: number;
    reviews: ReviewStats;
    avgResponseMinutes: number | null;
    cancellationRate: number | null;
    repeatClientRate: number | null;
  };
};

export type Specialty = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  categoryId: "licensed" | "portfolio";
  relatedGoalIds: string[];
  icon: string;
  isActive: boolean;
  scopeNote?: string;
};

export type Goal = {
  id: string;
  slug: string;
  name: string;
  relatedSpecialtyIds: string[];
  status: "planned" | "active";
};

export type SearchRequest = {
  query: string;
  location?: string;
  mode: "directory" | "goal";
};
