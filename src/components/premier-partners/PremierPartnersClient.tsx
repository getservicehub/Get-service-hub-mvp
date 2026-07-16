"use client";

import { getProviderName, getContactLinks, type ServiceCard } from "@/lib/services/queries";
import { CategoryIcon } from "@/lib/services/categoryIcons";

type Props = {
  services: ServiceCard[];
};

export default function PremierPartnersClient({ services }: Props) {
  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[1140px] mx-auto">
        <div className="text-xs font-bold tracking-[2px] uppercase text-amber-400 mb-3">Premier Partners</div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">San Diego's Elite Service Pros</h1>
        <p className="text-base text-muted2 max-w-[540px] mb-10">Only 3 exclusive spots total. Maximum visibility, maximum trust. Rotates weekly among Premier partners.</p>

        {services.length === 0 && (
          <div className="text-center py-16 bg-card border border-amber-400/20 rounded-2xl">
            <div className="text-5xl mb-4">👑</div>
            <div className="text-muted2 text-sm mb-2">No Premier spots claimed yet.</div>
            <div className="text-muted2 text-xs">Be one of the first 3 businesses in San Diego.</div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s) => {
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
                      <span className="px-3 py-1 rounded-full text-[11px] font-black bg-amber-400 text-[#1a1206]">👑 PREMIER</span>
                    </div>
                  </div>
                  <div className="px-5 pt-5">
                    <div className="text-lg font-extrabold mb-1">{name}</div>
                    <div className="text-xs text-muted2 mb-3">{s.title} - {s.city}</div>
                  </div>
                </a>
                <div className="px-5 pb-5 flex gap-2">
                  {telLink && <a href={telLink} className="flex-1 text-center py-2.5 rounded-lg text-xs font-bold bg-red-500 text-white">Call</a>}
                  {smsLink && <a href={smsLink} className="flex-1 text-center py-2.5 rounded-lg text-xs font-bold bg-blue-500 text-white">Text</a>}
                  {waLink && <a href={waLink} target="_blank" className="flex-1 text-center py-2.5 rounded-lg text-xs font-bold bg-green-500 text-white">WhatsApp</a>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
