"use client";
import { useProLang } from "../../lib/pro-i18n";
import { ExpertiseCard } from "./ExpertiseCard";
import type { Specialty } from "../../../types/pro";
export function ExpertiseGrid({ specialties }: { specialties: Specialty[] }) {
  const { t } = useProLang();
  return (
    <section id="explore" className="px-5 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-6 text-lg font-semibold text-[var(--pro-text)]">{t.expertise.title}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {specialties.filter((s) => s.isActive).map((specialty) => (
            <ExpertiseCard key={specialty.id} specialty={specialty} professionalCount={undefined} exploreLabel={t.expertise.exploreLink} />
          ))}
        </div>
      </div>
    </section>
  );
}
