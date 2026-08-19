export const LEGAL_VERSIONS = {
  terms: "1.0",
  privacy: "1.0",
  community: "1.0",
} as const;

export const LEGAL_EFFECTIVE_DATE = "August 19, 2026";

export type LegalDocumentType = keyof typeof LEGAL_VERSIONS;
