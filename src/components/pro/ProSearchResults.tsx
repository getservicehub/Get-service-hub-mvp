"use client";
import { useMemo, useState } from "react";
import { useProLang } from "../../lib/pro-i18n";
import { ProfessionalCard } from "./ProfessionalCard";
import type { Specialty } from "../../../types/pro";
import type { MaybeDemoProfessional } from "../../../data/pro/professionals";

export function ProSearchResults({
  professionals,
  specialties,
  initialQuery,
  initialLocation,
}: {
  professionals: MaybeDemoProfessional[];
  specialties: Specialty[];
  initialQuery: string;
  initialLocation: string;
}) {
  const { t } = useProLang();
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("all");

  const specialtyNameById = useMemo(() => {
    const map: Record<string, string> = {};
    for (const s of specialties) map[s.id] = s.name;
    return map;
  }, [specialties]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const loc = location.trim().toLowerCase();
    return professionals.filter((p) => {
      if (specialtyFilter !== "all" && !p.specialtyIds.includes(specialtyFilter)) return false;
      if (loc) {
        const hay = `${p.city} ${p.state}`.toLowerCase();
        if (!hay.includes(loc)) return false;
      }
      if (q) {
        const specialtyNames = p.specialtyIds.map((id) => specialtyNameById[id] ?? "").join(" ");
        const hay = `${p.displayName} ${p.profession} ${p.bio} ${specialtyNames}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [professionals, query, location, specialtyFilter, specialtyNameById]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.hero.searchSpecialtyPlaceholder}
          className="flex-1 rounded-lg border border-[var(--pro-line)] bg-[var(--pro-panel)] px-4 py-2.5 text-sm text-[var(--pro-text)] placeholder:text-[var(--pro-text-muted)]/70 focus:outline-none"
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder={t.hero.searchLocationPlaceholder}
          className="flex-1 rounded-lg border border-[var(--pro-line)] bg-[var(--pro-panel)] px-4 py-2.5 text-sm text-[var(--pro-text)] placeholder:text-[var(--pro-text-muted)]/70 focus:outline-none sm:max-w-[220px]"
        />
        <select
          value={specialtyFilter}
          onChange={(e) => setSpecialtyFilter(e.target.value)}
          aria-label={t.search.filterBySpecialty}
          className="rounded-lg border border-[var(--pro-line)] bg-[var(--pro-panel)] px-4 py-2.5 text-sm text-[var(--pro-text)] focus:outline-none sm:max-w-[200px]"
        >
          <option value="all">{t.search.allSpecialties}</option>
          {specialties.filter((s) => s.isActive).map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      <p className="mb-4 text-sm font-semibold text-[var(--pro-text)]">
        {t.search.resultsTitle}{results.length > 0 ? ` (${results.length})` : ""}
      </p>

      {results.length === 0 ? (
        <div className="rounded-lg border border-[var(--pro-line)] bg-[var(--pro-panel)] p-8 text-center">
          <p className="text-sm font-semibold text-[var(--pro-text)]">{t.search.noResultsTitle}</p>
          <p className="mt-1 text-sm text-[var(--pro-text-muted)]">{t.search.noResultsBody}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((professional) => (
            <ProfessionalCard key={professional.id} professional={professional} t={t.professional} />
          ))}
        </div>
      )}
    </div>
  );
}
