"use client";
import Link from "next/link";

import { getProviderName, getContactLinks, type ServiceCard } from "@/lib/services/queries";
import { CategoryIcon } from "@/lib/services/categoryIcons";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type Props = {
  eliteServices: ServiceCard[];
  plusServices: ServiceCard[];
};

export default function EliteClient({ eliteServices, plusServices }: Props) {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[1140px] mx-auto">
        <div className="text-xs font-bold tracking-[2px] uppercase text-amber-400 mb-3">{t("elite_eyebrow")}</div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">{t("elite_title")}</h1>
        <p className="text-base text-muted2 max-w-[540px] mb-10">{t("elite_subtitle")}</p>

        {eliteServices.length === 0 && (
          <Link href="/dashboard/upgrade" className="block text-center py-16 bg-card border border-amber-400/20 rounded-2xl mb-14 hover:border-amber-400/40 transition-all">
            <div className="text-5xl mb-4">👑</div>
            <div className="text-muted2 text-sm mb-2">{t("elite_empty_title")}</div>
            <div className="text-muted2 text-xs">{t("elite_empty_sub")}</div>
          </Link>
        )}

        {eliteServices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            {eliteServices.map((s) => {
              const name = getProviderName(s);
              const { telLink, waLink, smsLink } = getContactLinks(s);
              const hasImage = s.image_url !== null && s.image_url !== "";

              return (
                <div key={s.id} className="bg-card border-2 border-amber-400/30 rounded-[24px] overflow-hidden hover:border-amber-400/50 hover:-translate-y-1 transition-all">
                  <a href={`/service/${s.id}`} className="block">
                    <div className="relative w-full h-[200px] flex items-center justify-center text-amber-400 bg-gradient-to-br from-[#1a1206] to-[#0A1628] overflow-hidden">
                      {hasImage && <img src={s.image_url as string} alt={s.title} className="w-full h-full object-cover" />}
                      {!hasImage && <CategoryIcon name={s.categories?.name || ""} className="w-14 h-14" />}
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full text-[11px] font-black bg-amber-400 text-[#1a1206]">👑 ELITE</span>
                      </div>
                    </div>
                    <div className="px-5 pt-5">
                      <div className="text-lg font-extrabold mb-1">{name}</div>
                      <div className="text-xs text-muted2 mb-3">{s.title} - {s.city}</div>
                    </div>
                  </a>
                  <div className="px-5 pb-5 flex gap-2">
                    {telLink && <a href={telLink} className="flex-1 text-center py-2.5 rounded-lg text-xs font-bold bg-red-500 text-white">{t("action_call")}</a>}
                    {smsLink && <a href={smsLink} className="flex-1 text-center py-2.5 rounded-lg text-xs font-bold bg-blue-500 text-white">{t("action_text")}</a>}
                    {waLink && <a href={waLink} target="_blank" className="flex-1 text-center py-2.5 rounded-lg text-xs font-bold bg-green-500 text-white">{t("action_whatsapp")}</a>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {plusServices.length > 0 && (
          <div>
            <div className="text-xs font-bold tracking-[2px] uppercase text-cyan-400 mb-3">{t("elite_also_featured")}</div>
            <h2 className="text-xl font-extrabold mb-6">{t("elite_plus_partners")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {plusServices.map((s) => {
                const name = getProviderName(s);
                const hasImage = s.image_url !== null && s.image_url !== "";

                return (
                  <a key={s.id} href={`/service/${s.id}`} className="block bg-card border border-cyan-400/20 rounded-2xl overflow-hidden hover:border-cyan-400/40 transition-all">
                    <div className="w-full h-[120px] flex items-center justify-center text-cyan-400 bg-gradient-to-br from-[#0A1628] to-[#0D1A2E] overflow-hidden">
                      {hasImage && <img src={s.image_url as string} alt={s.title} className="w-full h-full object-cover" />}
                      {!hasImage && <CategoryIcon name={s.categories?.name || ""} className="w-9 h-9" />}
                    </div>
                    <div className="p-3">
                      <div className="text-[13px] font-bold truncate">{name}</div>
                      <div className="text-[11px] text-muted2 truncate">{s.title}</div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
