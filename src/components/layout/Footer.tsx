"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-bg2 border-t border-white/[.08] pt-14 pb-8 px-5">
      <div className="max-w-[1140px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <Image src="/logo-horizontal.png" alt="GetServiHub" width={160} height={36} className="h-8 w-auto mb-3" />
          <p className="text-xs text-muted2 leading-relaxed mb-3">{t("footer_desc")}</p>
          <div className="text-[11px] font-bold tracking-[2px] text-cyan-400">{t("footer_tagline")}</div>
        </div>

        <div>
          <div className="text-[11px] font-bold tracking-[1.5px] uppercase text-muted2 mb-4">{t("footer_explore")}</div>
          <div className="flex flex-col gap-2.5">
            <Link href="/directory" className="text-xs text-muted2 hover:text-white">{t("nav_browse")}</Link>
            <Link href="/discover" className="text-xs text-muted2 hover:text-white">{t("nav_discover")}</Link>
            <Link href="/featured" className="text-xs text-muted2 hover:text-white">{t("nav_featured")}</Link>
            <Link href="/gallery" className="text-xs text-muted2 hover:text-white">{t("nav_gallery")}</Link>
          </div>
        </div>

        <div>
          <div className="text-[11px] font-bold tracking-[1.5px] uppercase text-muted2 mb-4">{t("footer_company")}</div>
          <div className="flex flex-col gap-2.5">
            <Link href="/about" className="text-xs text-muted2 hover:text-white">{t("footer_about")}</Link>
            <Link href="/trust-safety" className="text-xs text-muted2 hover:text-white">{t("footer_trust")}</Link>
            <Link href="/contact" className="text-xs text-muted2 hover:text-white">{t("footer_contact")}</Link>
            <Link href="/report" className="text-xs text-muted2 hover:text-white">{t("footer_report")}</Link>
            <Link href="/register" className="text-xs text-muted2 hover:text-white">{t("footer_list")}</Link>
          </div>
        </div>

        <div>
          <div className="text-[11px] font-bold tracking-[1.5px] uppercase text-muted2 mb-4">{t("footer_legal")}</div>
          <div className="flex flex-col gap-2.5">
            <Link href="/terms" className="text-xs text-muted2 hover:text-white">{t("footer_terms")}</Link>
            <Link href="/privacy" className="text-xs text-muted2 hover:text-white">{t("footer_privacy")}</Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1140px] mx-auto mt-10 pt-6 border-t border-white/[.08] flex flex-col md:flex-row justify-between items-center gap-3">
        <span className="text-[11px] text-muted2">© {new Date().getFullYear()} GetServiHub. {t("footer_rights")}</span>
        <span className="text-[11px] text-muted2">hello@getservihub.com</span>
      </div>
    </footer>
  );
}
