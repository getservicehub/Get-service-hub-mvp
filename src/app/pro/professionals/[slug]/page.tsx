import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllProfessionals, getProfessionalBySlug } from "../../../../../data/pro/professionals";
import { getSpecialties } from "../../../../../data/pro/categories";
import { ProfessionalProfileClient } from "./ProfessionalProfileClient";

export async function generateStaticParams() {
  const professionals = await getAllProfessionals();
  return professionals.map((p) => ({ slug: p.slug }));
}

// Next.js 16: params es una Promise.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const professional = await getProfessionalBySlug(slug);
  if (!professional) return {};
  return {
    title: `${professional.displayName} — GetServiHub Pro`,
    description: professional.bio,
    alternates: { canonical: `/pro/professionals/${professional.slug}` },
  };
}

export default async function ProfessionalProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const professional = await getProfessionalBySlug(slug);
  if (!professional) notFound();

  const specialties = await getSpecialties();

  return <ProfessionalProfileClient professional={professional} specialties={specialties} />;
}
