import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSpecialtyBySlug } from "../../../../../data/pro/categories";
import { getProfessionalsBySpecialty } from "../../../../../data/pro/professionals";
import { ProfessionalGrid } from "../../../../components/pro/ProfessionalGrid";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const specialty = await getSpecialtyBySlug(slug);
  if (!specialty) {
    return { title: "Not Found | GetServiHub Pro" };
  }
  const title = `${specialty.name} — GetServiHub Pro`;
  const description = specialty.shortDescription;
  return { title, description, openGraph: { title, description } };
}

export default async function ExpertiseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const specialty = await getSpecialtyBySlug(slug);
  if (!specialty) {
    notFound();
  }
  const professionals = await getProfessionalsBySpecialty(specialty.id);
  return <ProfessionalGrid specialty={specialty} professionals={professionals} />;
}
