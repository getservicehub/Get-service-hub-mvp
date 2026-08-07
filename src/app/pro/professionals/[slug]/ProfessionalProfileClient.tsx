"use client";

import Link from "next/link";
import { useProLang } from "../../../../lib/pro-i18n";
import { ProIcon } from "../../../../components/pro/icons";
import type { Specialty } from "../../../../../types/pro";
import type { MaybeDemoProfessional } from "../../../../../data/pro/professionals";

export function ProfessionalProfileClient({
  professional, specialties,
}: { professional: MaybeDemoProfessional; specialties: Specialty[] }) {
  const { t } = useProLang();
  const initials = professional.displayName.split(" ").map((n) => n[0]).join("").slice(0, 2);
  const profSpecialties = specialties.filter((s) => professional.specialtyIds.includes(s.id));

  return (
    <main className="px-5 py-12 md:px-8">
      <div className="mx-auto max-w-2xl">
        <Link href={profSpecialties[0] ? `/pro/expertise/${profSpecialties[0].slug}` : "/pro"} className="text-xs text-[var(--pro-text-muted)] hover:text-[var(--pro-text)]">
          ← {t.nav.explore}
        </Link>
        <div className="mt-6 rounded-xl border border-[var(--pro-line)] bg-[var(--pro-panel)] p-6">
          {professional.isDemo && (
            <span className="mb-4 inline-flex w-fit items-center rounded-full border border-[var(--pro-gold)]/50 bg-[var(--pro-gold)]/10 px-2 py-0.5 font-mono text-[10px] tracking-wide text-[var(--pro-gold-bright)]">
              {t.professional.demoLabel}
            </span>
          )}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[var(--pro-gold)]/60 font-mono text-lg font-semibold text-[var(--pro-gold-bright)]">{initials}</div>
            <div>
              <h1 className="text-xl font-semibold text-[var(--pro-text)]">{professional.displayName}</h1>
              <p className="text-sm text-[var(--pro-text-muted)]">{professional.profession}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-[var(--pro-text-muted)]">{professional.city}, {professional.state} · {professional.languages.join(" · ")}</p>
          <p className="mt-4 text-sm text-[var(--pro-text)]">{professional.bio}</p>
          {professional.yearsExperience && (
            <p className="mt-3 text-xs text-[var(--pro-text-muted)]">{professional.yearsExperience.value} {t.professional.yearsDeclared}</p>
          )}
          {profSpecialties.length > 0 && (
            <div className="mt-5">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--pro-text-muted)]">{t.professional.specialtiesLabel}</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {profSpecialties.map((s) => (
                  <span key={s.id} className="rounded-full border border-[var(--pro-line)] px-3 py-1 text-xs text-[var(--pro-text)]">{s.name}</span>
                ))}
              </div>
            </div>
          )}
          <div className="mt-5 flex flex-wrap gap-3 border-t border-[var(--pro-line)] pt-4">
            {professional.verification.identity === "verified" && (
              <span className="inline-flex items-center gap-1 text-xs text-[#7fb89a]"><ProIcon name="shield-check" className="h-4 w-4" />{t.professional.identityVerified}</span>
            )}
            {professional.verification.license === "verified" && (
              <span className="inline-flex items-center gap-1 text-xs text-[#7fb89a]"><ProIcon name="shield-check" className="h-4 w-4" />{t.professional.licenseVerified}</span>
            )}
            {professional.verification.license === "not_required" && (
              <span className="inline-flex items-center gap-1 text-xs text-[var(--pro-text-muted)]"><ProIcon name="shield-check" className="h-4 w-4" />{t.professional.licenseNotApplicable}</span>
            )}
          </div>
          <button type="button" disabled className="mt-6 w-full cursor-not-allowed rounded-md bg-[var(--pro-gold)]/40 px-4 py-3 text-sm font-semibold text-[var(--pro-navy)]/60" title="La mensajería directa se conecta en el Bloque 5">
            Contactar (próximamente)
          </button>
        </div>
      </div>
    </main>
  );
}
