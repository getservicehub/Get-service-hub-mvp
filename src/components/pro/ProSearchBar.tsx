"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProLang } from "../../lib/pro-i18n";
import { ProIcon } from "./icons";
import type { SearchRequest } from "../../../types/pro";

export function ProSearchBar() {
  const { t } = useProLang();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const request: SearchRequest = { query, location, mode: "directory" };
    const params = new URLSearchParams({ q: request.query, loc: request.location ?? "" });
    router.push(`/pro/search?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 rounded-xl border border-[var(--pro-line)] bg-[var(--pro-panel)] p-2 sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center gap-2 px-3">
        <ProIcon name="search" className="h-4 w-4 shrink-0 text-[var(--pro-text-muted)]" />
        <label htmlFor="pro-search-query" className="sr-only">{t.hero.searchSpecialtyPlaceholder}</label>
        <input id="pro-search-query" type="text" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder={t.hero.searchSpecialtyPlaceholder}
          className="w-full bg-transparent py-3 text-sm text-[var(--pro-text)] placeholder:text-[var(--pro-text-muted)]/70 focus:outline-none" />
      </div>
      <div className="hidden h-6 w-px bg-[var(--pro-line)] sm:block" />
      <div className="flex flex-1 items-center gap-2 px-3">
        <ProIcon name="map-pin" className="h-4 w-4 shrink-0 text-[var(--pro-text-muted)]" />
        <label htmlFor="pro-search-location" className="sr-only">{t.hero.searchLocationPlaceholder}</label>
        <input id="pro-search-location" type="text" value={location} onChange={(e) => setLocation(e.target.value)}
          placeholder={t.hero.searchLocationPlaceholder}
          className="w-full bg-transparent py-3 text-sm text-[var(--pro-text)] placeholder:text-[var(--pro-text-muted)]/70 focus:outline-none" />
      </div>
      <button type="submit" className="rounded-lg bg-gradient-to-r from-[var(--pro-gold-bright)] to-[var(--pro-gold)] px-6 py-3 text-sm font-semibold text-[var(--pro-navy)] transition-transform hover:scale-[1.02]">
        {t.hero.searchButton}
      </button>
    </form>
  );
}
