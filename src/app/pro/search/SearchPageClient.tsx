"use client";

import { useMemo, useState } from "react";
import { useProLang } from "../../../lib/pro-i18n";
import { ProfessionalCard } from "../../../components/pro/ProfessionalCard";
import type { Specialty } from "../../../../types/pro";
import type { MaybeDemoProfessional } from "../../../../data/pro/professionals";

export function SearchPageClient({
  initialQuery, initialLocation, professionals, specialties,
}: {
  initialQuery: string; initialLocation: string;
  professionals: MaybeDemoProfessional[]; specialties: Specialty[];
}) {
  const { t } = useProLang();
  const [query, setQuery] = useState(initialQuery);
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("all");
  const [location] = useState(initialLocation);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return professionals.filter((p) => {
      const matchesQuery = q === "" || p.displayName.toLowerCase().includes(q) || p.profession.toLowerCase().includes(q) || p.bio.toLowerCase().includes(q);
      const matchesSpecialty = specialtyFilter === "all" || p.specialtyIds.includes(specialtyFilter);
      return matchesQuery && matchesSpecialty;
    });
  }, [query, specialtyFilter, professionals]);

  return (
    <main className="px-5 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-xl font-semibold text-[var(--pro-text)]">{t.search.resultsTitle}</h1>
        {location && <p className="mt-1 text-xs text-[var(--pro-text-muted)]">{location}</p>}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.hero.searchSpecialtyPlaceholder} aria-label={t.hero.searchSpecialtyPlaceholder}
            className="rounded-md border border-[var(--pro-line)] bg-[var(--pro-panel)] px-3 py-2 text-sm text-[var(--pro-text)] focus:outline-none sm:max-w-xs" />
          <label className="flex items-center gap-2 text-xs text-[var(--pro-text-muted)]">
            {t.search.filterBySpecialty}
            <select value={specialtyFilter} onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="rounded-md border border-[var(--pro-line)] bg-[var(--pro-panel)] px-2 py-1.5 text-xs text-[var(--pro-text)] focus:outline-none">
              <option value="all">{t.search.allSpecialties}</option>
              {specialties.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </label>
        </div>
        <div className="mt-8">
          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((p) => <ProfessionalCard key={p.id} professional={p} t={t.professional} />)}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-[var(--pro-line)] p-8 text-center">
              <p className="text-sm font-medium text-[var(--pro-text)]">{t.search.noResultsTitle}</p>
              <p className="mt-1 text-xs text-[var(--pro-text-muted)]">{t.search.noResultsBody}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
