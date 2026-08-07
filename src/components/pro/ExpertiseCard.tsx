import Link from "next/link";
import type { Specialty } from "../../../types/pro";
import { ProIcon } from "./icons";

export function ExpertiseCard({
  specialty, professionalCount, exploreLabel,
}: { specialty: Specialty; professionalCount?: number; exploreLabel: string }) {
  const verificationType = specialty.categoryId;
  return (
    <Link href={`/pro/expertise/${specialty.slug}`} className="group flex flex-col justify-between rounded-lg border border-[var(--pro-line)] bg-[var(--pro-panel)] p-5 transition-colors hover:border-[var(--pro-gold-bright)]/60">
      <div>
        <div className="flex items-center justify-between">
          <ProIcon name={specialty.icon as never} className="h-6 w-6 text-[var(--pro-gold-bright)]" />
          <span className="rounded-full border border-[var(--pro-line)] px-2 py-0.5 font-mono text-[10px] text-[var(--pro-text-muted)]">
            {verificationType === "licensed" ? "LICENCIA" : "PORTAFOLIO"}
          </span>
        </div>
        <h3 className="mt-3 text-[15px] font-semibold text-[var(--pro-text)]">{specialty.name}</h3>
        <p className="mt-1 text-[13px] text-[var(--pro-text-muted)]">{specialty.shortDescription}</p>
        {typeof professionalCount === "number" && (
          <p className="mt-2 font-mono text-[11px] text-[var(--pro-text-muted)]">{professionalCount} profesionales</p>
        )}
      </div>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--pro-gold-bright)]">
        {exploreLabel}
        <ProIcon name="arrow-right" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
