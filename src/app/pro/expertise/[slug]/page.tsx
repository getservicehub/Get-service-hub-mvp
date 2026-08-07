import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSpecialties, getSpecialtyBySlug } from "../../../../../data/pro/categories";
import { getProfessionalsBySpecialty } from "../../../../../data/pro/professionals";
import { SpecialtyPageClient } from "./SpecialtyPageClient";

export async function generateStaticParams() {
  const specialties = await getSpecialties();
  return specialties.map((s) => ({ slug: s.slug }));
}

// Next.js 16: params es una Promise — hay que hacer await antes de usarlo.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const specialty = await getSpecialtyBySlug(slug);
  if (!specialty) return {};
  return {
    title: `${specialty.name} — GetServiHub Pro`,
    description: specialty.shortDescription,
    alternates: { canonical: `/pro/expertise/${specialty.slug}` },
  };
}

export default async function ExpertiseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const specialty = await getSpecialtyBySlug(slug);
  if (!specialty) notFound();

  const relatedProfessionals = await getProfessionalsBySpecialty(specialty.id);

  return <SpecialtyPageClient specialty={specialty} professionals={relatedProfessionals} />;
}
