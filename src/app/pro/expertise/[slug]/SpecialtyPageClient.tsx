"use client";

import Link from "next/link";
import { useProLang } from "../../../../lib/pro-i18n";
import { ProfessionalCard } from "../../../../components/pro/ProfessionalCard";
import type { Specialty } from "../../../../../types/pro";
import type { MaybeDemoProfessional } from "../../../../../data/pro/professionals";

export function SpecialtyPageClient({
  specialty, professionals,
}: { specialty: Specialty; professionals: MaybeDemoProfessional[] }) {
  const { t } = useProLang();
  const verificationType = specialty.categoryId;

  return (
    <main className="px-5 py-12 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/pro" className="text-xs text-[var(--pro-text-muted)] hover:text-[var(--pro-text)]">← {t.nav.explore}</Link>
        <div className="mt-4 flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-[var(--pro-text)]">{specialty.name}</h1>
          <span className="rounded-full border border-[var(--pro-line)] px-2 py-0.5 font-mono text-[10px] text-[var(--pro-text-muted)]">
            {verificationType === "licensed" ? "LICENCIA" : "PORTAFOLIO"}
          </span>
        </div>
        <p className="mt-2 max-w-xl text-sm text-[var(--pro-text-muted)]">{specialty.shortDescription}</p>
        {specialty.scopeNote && (
          <p className="mt-3 max-w-xl border-l-2 border-[var(--pro-gold)] py-1 pl-3 text-xs text-[var(--pro-text-muted)]">{specialty.scopeNote}</p>
        )}
        <div className="mt-10">
          {professionals.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {professionals.map((pro) => <ProfessionalCard key={pro.id} professional={pro} t={t.professional} />)}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-[var(--pro-line)] p-8 text-center">
              <p className="text-sm font-medium text-[var(--pro-text)]">{t.professional.emptyStateTitle}</p>
              <p className="mt-1 text-xs text-[var(--pro-text-muted)]">{t.professional.emptyStateBody}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
