"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useProLang } from "../../lib/pro-i18n";
import { ProIcon } from "./icons";

export function ProHeader() {
  const { lang, setLang, t } = useProLang();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/pro", label: t.nav.explore },
    { href: "/pro#how-it-works", label: t.nav.howItWorks },
    { href: "/pro#trust", label: t.nav.trust },
    { href: "/pro/join", label: t.nav.forProfessionals },
  ];

  return (
    <header className="relative border-b border-[var(--pro-line)] bg-[var(--pro-bg)] z-10">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/pro" className="flex items-center gap-2">
          <Image src="/brand/logo-getservihub-pro.png" alt="GetServiHub Pro" width={160} height={40} className="h-9 w-auto" priority />
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-[var(--pro-text-muted)] transition-colors hover:text-[var(--pro-text)]">
              {link.label}
            </Link>
          ))}
          <LangToggle lang={lang} setLang={setLang} />
          <Link href="/pro/login" className="text-sm text-[var(--pro-text-muted)] hover:text-[var(--pro-text)]">
            {t.nav.login}
          </Link>
          <Link href="/pro/join" className="rounded-md bg-[var(--pro-gold)] px-4 py-2 text-sm font-semibold text-[var(--pro-navy)] transition-transform hover:scale-[1.03]">
            {t.nav.joinCta}
          </Link>
        </div>

        <button type="button" aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)} className="flex h-9 w-9 items-center justify-center text-[var(--pro-text)] md:hidden">
          <ProIcon name={menuOpen ? "x" : "menu"} className="h-6 w-6" />
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-[var(--pro-line)] bg-[var(--pro-bg)] px-5 py-5 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="text-base text-[var(--pro-text)]">
                {link.label}
              </Link>
            ))}
            <div className="flex items-center justify-between border-t border-[var(--pro-line)] pt-4">
              <Link href="/pro/login" className="text-sm text-[var(--pro-text-muted)]">{t.nav.login}</Link>
              <LangToggle lang={lang} setLang={setLang} />
            </div>
            <Link href="/pro/join" onClick={() => setMenuOpen(false)} className="rounded-md bg-[var(--pro-gold)] px-4 py-3 text-center text-sm font-semibold text-[var(--pro-navy)]">
              {t.nav.joinCta}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function LangToggle({ lang, setLang }: { lang: "es" | "en"; setLang: (l: "es" | "en") => void }) {
  return (
    <div className="flex overflow-hidden rounded border border-[var(--pro-line)] font-mono text-xs" role="group" aria-label="Idioma / Language">
      {(["es", "en"] as const).map((code) => (
        <button key={code} type="button" aria-current={lang === code} onClick={() => setLang(code)}
          className={"px-2.5 py-1.5 transition-colors " + (lang === code ? "bg-white/10 text-[var(--pro-text)]" : "text-[var(--pro-text-muted)] hover:text-[var(--pro-text)]")}>
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
