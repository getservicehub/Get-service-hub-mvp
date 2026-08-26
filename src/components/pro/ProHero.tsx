"use client";
import { useProLang } from "../../lib/pro-i18n";
import { ProSearchBar } from "./ProSearchBar";
export function ProHero() {
  const { t } = useProLang();
  return (
    <section className="px-5 pb-10 pt-14 md:px-8 md:pt-20">
      <div className="mx-auto max-w-3xl text-center">
        <span className="font-mono text-xs uppercase tracking-widest text-[var(--pro-gold-bright)]">{t.hero.eyebrow}</span>
        <h1 className="mt-4 font-[family-name:var(--font-playfair)] text-[clamp(28px,4.5vw,44px)] italic leading-tight text-[var(--pro-text)]">{t.hero.title}</h1>
        <p className="mx-auto mt-4 max-w-xl text-[15px] text-[var(--pro-text-muted)]">{t.hero.subtitle}</p>
        <div className="mx-auto mt-8 max-w-xl"><ProSearchBar /></div>
      </div>
    </section>
  );
}
