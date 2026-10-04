"use client";
import Image from "next/image";
import { useProLang } from "../../lib/pro-i18n";
import { ProIcon } from "./icons";
import type { Specialty } from "../../../types/pro";
import type { MaybeDemoProfessional } from "../../../data/pro/professionals";
import type { ProfessionalStatsRow } from "../../../types/database";

export function ProfessionalProfile({
  professional,
  specialties,
  stats,
}: {
  professional: MaybeDemoProfessional;
  specialties: Specialty[];
  stats: ProfessionalStatsRow | null;
}) {
  const { t } = useProLang();
  const initials = professional.displayName.split(" ").map((n) => n[0]).join("").slice(0, 2);
  const memberSinceYear = new Date(professional.joinedAt).getFullYear();
  const heroSpecialty = specialties[0];

  return (
    <div>
      <div className="relative h-[260px] w-full overflow-hidden border-b border-[var(--pro-line)] sm:h-[340px]">
        {heroSpecialty && (
          <Image src={`/categories/${heroSpecialty.id}.jpg`} alt="" fill priority className="object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--pro-bg)] via-[var(--pro-bg)]/70 to-[var(--pro-bg)]/10" />
      </div>

      <div className="relative mx-auto -mt-24 max-w-4xl px-5 pb-10 md:px-8">
        {professional.isDemo && (
          <span className="mb-4 inline-flex w-fit items-center rounded-full border border-[var(--pro-gold)]/50 bg-[var(--pro-gold)]/10 px-2 py-0.5 font-mono text-[10px] tracking-wide text-[var(--pro-gold-bright)]">
            {t.professional.demoLabel}
          </span>
        )}

        <div className="flex flex-col gap-6 rounded-lg border border-[var(--pro-line)] bg-[var(--pro-panel)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:flex-row sm:items-start">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-[var(--pro-gold)] bg-[var(--pro-bg)] font-mono text-2xl font-semibold text-[var(--pro-gold-bright)]">
            {initials}
          </div>
          <div className="flex-1">
            <h1 className="font-[family-name:var(--font-cormorant)] text-3xl italic text-[var(--pro-text)]">{professional.displayName}</h1>
            <p className="mt-1 text-sm text-[var(--pro-text-muted)]">{professional.profession}</p>
            <p className="mt-1 text-sm text-[var(--pro-text-muted)]">
              {professional.city}, {professional.state} · {professional.languages.join(" · ")}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {professional.verification.identity === "verified" && (
                <span className="inline-flex items-center gap-1 text-[12px] text-[#7fb89a]">
                  <ProIcon name="shield-check" className="h-3.5 w-3.5" />{t.professional.identityVerified}
                </span>
              )}
              {professional.verification.license === "verified" && (
                <span className="inline-flex items-center gap-1 text-[12px] text-[#7fb89a]">
                  <ProIcon name="shield-check" className="h-3.5 w-3.5" />{t.professional.licenseVerified}
                </span>
              )}
              {professional.verification.license === "not_required" && (
                <span className="inline-flex items-center gap-1 text-[12px] text-[var(--pro-text-muted)]">
                  <ProIcon name="shield-check" className="h-3.5 w-3.5" />{t.professional.licenseNotApplicable}
                </span>
              )}
            </div>

            {professional.yearsExperience && (
              <p className="mt-2 text-sm text-[var(--pro-text-muted)]">
                {professional.yearsExperience.value} {t.professional.yearsDeclared}
              </p>
            )}
          </div>
        </div>

        <p className="mt-6 text-sm text-[var(--pro-text)]">{professional.bio}</p>

        {specialties.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-[var(--pro-text)]">{t.professional.specialtiesLabel}</p>
            <div className="flex flex-wrap gap-2">
              {specialties.map((s) => (
                <span key={s.id} className="rounded-full border border-[var(--pro-line)] px-3 py-1 text-xs text-[var(--pro-text-muted)]">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 rounded-lg border border-[var(--pro-line)] bg-[var(--pro-panel)] p-5">
          <p className="mb-3 text-sm font-semibold text-[var(--pro-text)]">{t.professional.trustTitle}</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xl font-semibold text-[var(--pro-gold-bright)]">{stats?.completed_jobs ?? 0}</p>
              <p className="text-xs text-[var(--pro-text-muted)]">{t.professional.completedJobs}</p>
            </div>
            <div>
              <p className="text-xl font-semibold text-[var(--pro-gold-bright)]">{stats?.verified_service_reviews ?? 0}</p>
              <p className="text-xs text-[var(--pro-text-muted)]">{t.professional.verifiedReviews}</p>
            </div>
            <div>
              <p className="text-xl font-semibold text-[var(--pro-gold-bright)]">{memberSinceYear}</p>
              <p className="text-xs text-[var(--pro-text-muted)]">{t.professional.memberSince}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
