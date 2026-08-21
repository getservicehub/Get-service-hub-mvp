"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { CategoryIcon } from "@/lib/services/categoryIcons";

const FEATURED = [
  { name: "Auto Detailing", photo: "auto-detailing", nameKey: "category_auto_detailing_name", subKey: "category_auto_detailing_sub" },
  { name: "Cleaning", photo: "cleaning", nameKey: "category_cleaning_name", subKey: "category_cleaning_sub" },
  { name: "Plumber", photo: "plumber", nameKey: "category_plumber_name", subKey: "category_plumber_sub" },
  { name: "Construction", photo: "construction", nameKey: "category_construction_name", subKey: "category_construction_sub" },
  { name: "Electrician", photo: "electrician", nameKey: "category_electrician_name", subKey: "category_electrician_sub" },
  { name: "Beauty Services", photo: "beauty-services", nameKey: "category_beauty_name", subKey: "category_beauty_sub" },
] as const;

export default function Categories() {
  const { t } = useLanguage();

  return (
    <section className="py-18 px-5" id="categories">
      <div className="max-w-[1140px] mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-xs font-bold tracking-[2px] uppercase text-cyan-400 mb-3">
              {t("categories_label")}
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
              {t("categories_title")}
            </h2>
          </div>
          <Link href="/find" className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:opacity-80 transition-opacity whitespace-nowrap">
            {t("categories_view_all")} →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURED.map((cat) => (
            <Link
              key={cat.name}
              href={`/find?category=${encodeURIComponent(cat.name)}`}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/[.08] hover:border-cyan-400/40 transition-all"
            >
              <Image src={`/categories/${cat.photo}.jpg`} alt={t(cat.nameKey)} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060D1A] via-[#060D1A]/40 to-transparent" />
              <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-[#0A1628]/80 backdrop-blur-sm flex items-center justify-center text-cyan-400">
                <CategoryIcon name={cat.name} className="w-4 h-4" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="text-sm font-bold mb-0.5">{t(cat.nameKey)}</div>
                <div className="text-[11px] text-muted2">{t(cat.subKey)}</div>
              </div>
            </Link>
          ))}

          <Link
            href="/find"
            className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/[.08] hover:border-cyan-400/40 transition-all bg-card flex flex-col items-center justify-center gap-2"
          >
            <div className="text-sm font-bold text-center px-4">{t("categories_all_title")}</div>
            <div className="text-[11px] text-muted2 text-center px-4">{t("categories_all_sub")}</div>
            <div className="w-9 h-9 rounded-full border border-cyan-400/40 flex items-center justify-center text-cyan-400 mt-1 group-hover:bg-cyan-400/10 transition-colors">→</div>
          </Link>
        </div>
      </div>
    </section>
  );
}
