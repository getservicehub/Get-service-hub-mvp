"use client";

import { getProviderName, getContactLinks, type ServiceCard } from "@/lib/services/queries";

type Props = {
  services: ServiceCard[];
};

export default function FeaturedClient({ services }: Props) {
  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[1140px] mx-auto">
        <div className="text-xs font-bold tracking-[2px] uppercase text-amber-400 mb-3">Premium Placement</div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Top-Rated Pros in San Diego</h1>
        <p className="text-base text-muted2 max-w-[540px] mb-10">Our Premium and Premier partners. Rotates weekly to keep things fair.</p>

        {services.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">👑</div>
            <div className="text-muted2 text-sm">No Premium spots claimed yet. Be the first.</div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => {
            const name = getProviderName(s);
            const { telLink, waLink, smsLink } = getContactLinks(s);
            const hasImage = s.image_url !== null && s.image_url !== "";

            return (
              <div key={s.id} className="bg-card border border-amber-400/20 rounded-[20px] overflow-hidden hover:border-amber-400/40 hover:-translate-y-1 transition-all">
                <a href={`/service/${s.id}`} className="block">
                  <div className="relative w-full h-[180px] flex items-center justify-center text-6xl bg-gradient-to-br from-[#0A1628] to-[#0D1A2E] overflow-hidden">
                    {hasImage && <img src={s.image_url as string} alt={s.title} className="w-full h-full object-cover" />}
                    {!hasImage && <span>{s.categories?.icon || "⚡"}</span>}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400/15 text-amber-400">{s.plan === "premier" ? "Premier" : "Premium"}</span>
                      {s.emergency && <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-500/15 text-red-400">Emergency</span>}
                    </div>
                  </div>
                  <div className="px-[18px] pt-[18px]">
                    <div className="text-[15px] font-extrabold mb-1">{name}</div>
                    <div className="text-xs text-muted2 mb-2">{s.title} - {s.city}</div>
                    <div className="flex items-center gap-3 mb-3.5 flex-wrap">
                      {s.espanol && <span className="text-[11px] text-cyan-400 font-semibold">Se habla espanol</span>}
                    </div>
                  </div>
                </a>
                <div className="px-[18px] pb-[18px]">
                  <div className="flex gap-2">
                    {telLink && <a href={telLink} className="flex-1 text-center py-2 rounded-lg text-xs font-bold bg-red-500 text-white">Call</a>}
                    {!telLink && <span className="flex-1 text-center py-2 rounded-lg text-xs font-bold bg-white/5 text-muted2">No phone</span>}
                    {smsLink && <a href={smsLink} className="flex-1 text-center py-2 rounded-lg text-xs font-bold bg-blue-500 text-white">Text</a>}
                    {waLink && <a href={waLink} target="_blank" className="flex-1 text-center py-2 rounded-lg text-xs font-bold bg-green-500 text-white">WhatsApp</a>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
