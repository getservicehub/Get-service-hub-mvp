import type { Metadata } from "next";
import { getAllProfessionals } from "../../../../data/pro/professionals";
import { getSpecialties } from "../../../../data/pro/categories";
import { SearchPageClient } from "./SearchPageClient";

export const metadata: Metadata = { title: "Buscar profesionales — GetServiHub Pro" };

// Next.js 16: searchParams también es una Promise.
export default async function ProSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; loc?: string }>;
}) {
  const { q, loc } = await searchParams;

  const [professionals, specialties] = await Promise.all([
    getAllProfessionals(),
    getSpecialties(),
  ]);

  return (
    <SearchPageClient
      initialQuery={q ?? ""}
      initialLocation={loc ?? ""}
      professionals={professionals}
      specialties={specialties}
    />
  );
}
