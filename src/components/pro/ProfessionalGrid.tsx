"use client";
import { useProLang } from "../../lib/pro-i18n";
import { ProfessionalCard } from "./ProfessionalCard";
import type { Specialty } from "../../../types/pro";
import type { MaybeDemoProfessional } from "../../../data/pro/professionals";

export function ProfessionalGrid({ specialty, professionals }: { specialty: Specialty; professionals: MaybeDemoProfessional[] }) {
  const { t } = useProLang();
  return (
    <section className="px-5 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[11px] tracking-wide text-[var(--pro-text-muted)]">
          {specialty.categoryId === "licensed" ? "LICENSED" : "PORTFOLIO"}
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--pro-text)]">{specialty.name}</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--pro-text-muted)]">{specialty.shortDescription}</p>
        {specialty.scopeNote && <p className="mt-1 text-xs text-[var(--pro-text-muted)]/80">{specialty.scopeNote}</p>}

        {professionals.length === 0 ? (
          <div className="mt-10 rounded-lg border border-[var(--pro-line)] bg-[var(--pro-panel)] p-8 text-center">
            <p className="text-sm font-semibold text-[var(--pro-text)]">{t.professional.emptyStateTitle}</p>
            <p className="mt-1 text-sm text-[var(--pro-text-muted)]">{t.professional.emptyStateBody}</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {professionals.map((professional) => (
              <ProfessionalCard key={professional.id} professional={professional} t={t.professional} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
