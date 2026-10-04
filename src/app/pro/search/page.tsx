import type { Metadata } from "next";
import { getAllProfessionals } from "../../../../data/pro/professionals";
import { getSpecialties } from "../../../../data/pro/categories";
import { ProSearchResults } from "../../../components/pro/ProSearchResults";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Find Professionals | GetServiHub Pro",
  description: "Search verified professionals by specialty, location, or keyword on GetServiHub Pro.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; loc?: string }>;
}) {
  const params = await searchParams;
  const [professionals, specialties] = await Promise.all([
    getAllProfessionals(),
    getSpecialties(),
  ]);
  return (
    <ProSearchResults
      professionals={professionals}
      specialties={specialties}
      initialQuery={params.q ?? ""}
      initialLocation={params.loc ?? ""}
    />
  );
}
