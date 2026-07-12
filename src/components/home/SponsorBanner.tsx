"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function SponsorBanner() {
  const { t } = useLanguage();

  return (
    <div className="max-w-[1140px] mx-auto px-5 py-6">
      <div className="relative bg-card border border-amber-400/20 rounded-2xl overflow-hidden">
        <div className="absolute top-3 left-3 text-[10px] font-bold tracking-[1.5px] uppercase text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full">
          Sponsored
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8">
          <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center text-3xl flex-shrink-0">
            👑
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="text-lg font-extrabold mb-1">{t("sponsor_title")}</div>
            <div className="text-sm text-muted2">{t("sponsor_sub")}</div>
            <div className="text-[11px] text-cyan-400/70 mt-1.5">{t("sponsor_disclaimer")}</div>
          </div>

          <Link href="/register" className="flex-shrink-0 px-6 py-3 rounded-lg gradient-bg text-white font-bold text-sm whitespace-nowrap hover:opacity-90 transition-all">
            {t("sponsor_cta")} →
          </Link>
        </div>
      </div>
    </div>
  );
}
