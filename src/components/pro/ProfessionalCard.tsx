import Link from "next/link";
import type { MaybeDemoProfessional } from "../../../data/pro/professionals";
import { ProIcon } from "./icons";

type Dictionary = {
  demoLabel: string; identityVerified: string; licenseVerified: string;
  licenseNotApplicable: string; viewProfile: string; yearsDeclared: string; specialtiesLabel: string;
};

export function ProfessionalCard({ professional, t }: { professional: MaybeDemoProfessional; t: Dictionary }) {
  const initials = professional.displayName.split(" ").map((n) => n[0]).join("").slice(0, 2);
  return (
    <div className="flex flex-col rounded-lg border border-[var(--pro-line)] bg-[var(--pro-panel)] p-5">
      {professional.isDemo && (
        <span className="mb-3 inline-flex w-fit items-center rounded-full border border-[var(--pro-gold)]/50 bg-[var(--pro-gold)]/10 px-2 py-0.5 font-mono text-[10px] tracking-wide text-[var(--pro-gold-bright)]">
          {t.demoLabel}
        </span>
      )}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--pro-gold)]/60 font-mono text-sm font-semibold text-[var(--pro-gold-bright)]">
          {initials}
        </div>
        <div>
          <h3 className="text-[15px] font-semibold text-[var(--pro-text)]">{professional.displayName}</h3>
          <p className="text-xs text-[var(--pro-text-muted)]">{professional.profession}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-[var(--pro-text-muted)]">{professional.city}, {professional.state} · {professional.languages.join(" · ")}</p>
      <p className="mt-2 text-[13px] text-[var(--pro-text)]">{professional.bio}</p>
      {professional.yearsExperience && (
        <p className="mt-2 text-xs text-[var(--pro-text-muted)]">{professional.yearsExperience.value} {t.yearsDeclared}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {professional.verification.identity === "verified" && (
          <span className="inline-flex items-center gap-1 text-[11px] text-[#7fb89a]"><ProIcon name="shield-check" className="h-3.5 w-3.5" />{t.identityVerified}</span>
        )}
        {professional.verification.license === "verified" && (
          <span className="inline-flex items-center gap-1 text-[11px] text-[#7fb89a]"><ProIcon name="shield-check" className="h-3.5 w-3.5" />{t.licenseVerified}</span>
        )}
        {professional.verification.license === "not_required" && (
          <span className="inline-flex items-center gap-1 text-[11px] text-[var(--pro-text-muted)]"><ProIcon name="shield-check" className="h-3.5 w-3.5" />{t.licenseNotApplicable}</span>
        )}
      </div>
      <Link href={`/pro/professionals/${professional.slug}`} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--pro-gold-bright)] hover:underline">
        {t.viewProfile}
        <ProIcon name="arrow-right" className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
