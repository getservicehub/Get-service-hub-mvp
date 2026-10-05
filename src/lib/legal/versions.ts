export const LEGAL_VERSIONS = {
  terms: "1.2",
  privacy: "1.2",
  community: "1.0",
} as const;

export const LEGAL_EFFECTIVE_DATE = "October 4, 2026";

export type LegalDocumentType = keyof typeof LEGAL_VERSIONS;
