import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProfessionalBySlug, getProfessionalStats } from "../../../../../data/pro/professionals";
import { getSpecialties } from "../../../../../data/pro/categories";
import { ProfessionalProfile } from "../../../../components/pro/ProfessionalProfile";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const professional = await getProfessionalBySlug(slug);
  if (!professional) {
    return { title: "Not Found | GetServiHub Pro" };
  }
  const title = `${professional.displayName} — ${professional.profession} | GetServiHub Pro`;
  const description = professional.bio;
  return { title, description, openGraph: { title, description } };
}

export default async function ProfessionalProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const professional = await getProfessionalBySlug(slug);
  if (!professional) {
    notFound();
  }
  const [allSpecialties, stats] = await Promise.all([
    getSpecialties(),
    getProfessionalStats(professional.id),
  ]);
  const specialties = allSpecialties.filter((s) => professional.specialtyIds.includes(s.id));
  return <ProfessionalProfile professional={professional} specialties={specialties} stats={stats} />;
}
