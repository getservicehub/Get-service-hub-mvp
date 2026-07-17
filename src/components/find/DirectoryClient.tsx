"use client";

import { useState } from "react";
import { getProviderName, type ServiceCard } from "@/lib/services/queries";
import StarRating from "@/components/ui/StarRating";
import { CategoryIcon } from "@/lib/services/categoryIcons";

type Category = { id: string; name: string; icon: string };

type ServiceWithRating = ServiceCard & {
  avg_rating: number | null;
  review_count: number;
  respondsQuickly: boolean;
};

type Props = {
  initialServices: ServiceWithRating[];
  sponsored: ServiceWithRating[];
  initialCategories: Category[];
  initialFilter: string;
  initialCity: string;
  cities: string[];
};

export default function DirectoryClient({ initialServices, sponsored, initialCategories, initialFilter, initialCity, cities }: Props) {
  const [filter, setFilter] = useState(initialFilter);
  const [cityFilter, setCityFilter] = useState(initialCity);

  const filtered = initialServices.filter((s) => {
    const matchesCategory = filter === "All" || s.categories?.name === filter;
    const matchesCity = cityFilter === "" || s.city === cityFilter;
    return matchesCategory && matchesCity;
  });

  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[1140px] mx-auto">

        {sponsored.length > 0 && (
          <div className="mb-10">
            <div className="text-[10px] font-bold tracking-[2px] uppercase text-amber-400 mb-4">Sponsored</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sponsored.map((s) => {
                const hasImage = s.image_url !== null && s.image_url !== "";
                return (
                  <a key={s.id} href={`/service/${s.id}`} className="block bg-card border border-amber-400/20 rounded-2xl overflow-hidden hover:border-amber-400/40 transition-all">
                    <div className="w-full h-[100px] flex items-center justify-center text-cyan-400 bg-gradient-to-br from-[#0A1628] to-[#0D1A2E] overflow-hidden">
                      {hasImage && <img src={s.image_url as string} alt={s.title} className="w-full h-full object-cover" />}
                      {!hasImage && <CategoryIcon name={s.categories?.name || ""} className="w-8 h-8" />}
                    </div>
                    <div className="p-3">
                      <div className="text-[12px] font-bold truncate">{getProviderName(s)}</div>
                      <div className="text-[10px] text-muted2 truncate">{s.title}</div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        <div className="text-xs font-bold tracking-[2px] uppercase text-cyan-400 mb-3">Find Local Pros</div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8">Browse All Professionals</h1>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="px-4 py-2.5 bg-card border border-white/20 rounded-lg text-sm text-white max-w-[220px]">
            <option value="" className="bg-bg2">📍 All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city} className="bg-bg2">{city}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2.5 mb-8">
          <button onClick={() => setFilter("All")} className={filter === "All" ? "px-4.5 py-2 rounded-full text-[13px] font-semibold gradient-bg text-white" : "px-4.5 py-2 rounded-full text-[13px] font-semibold border border-white/20 text-muted2"}>All</button>
          {initialCategories.map((cat) => (
            <button key={cat.id} onClick={() => setFilter(cat.name)} className={filter === cat.name ? "flex items-center gap-1.5 px-4.5 py-2 rounded-full text-[13px] font-semibold gradient-bg text-white" : "flex items-center gap-1.5 px-4.5 py-2 rounded-full text-[13px] font-semibold border border-white/20 text-muted2"}>
              <CategoryIcon name={cat.name} className="w-3.5 h-3.5" /> {cat.name}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📭</div>
            <div className="text-muted2 text-sm">No services found matching your filters.</div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((service) => {
            const hasImage = service.image_url !== null && service.image_url !== "";
            return (
              <a key={service.id} href={`/service/${service.id}`} className="block bg-card border border-white/[.08] rounded-[20px] overflow-hidden hover:border-white/20 hover:-translate-y-1 transition-all">
                <div className="w-full h-[160px] flex items-center justify-center text-cyan-400 bg-gradient-to-br from-[#0A1628] to-[#0D1A2E] overflow-hidden">
                  {hasImage && <img src={service.image_url as string} alt={service.title} className="w-full h-full object-cover" />}
                  {!hasImage && <CategoryIcon name={service.categories?.name || ""} className="w-12 h-12" />}
                </div>
                <div className="p-4">
                  <div className="text-[15px] font-extrabold mb-1">{getProviderName(service)}</div>
                  {service.avg_rating && (
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <StarRating rating={service.avg_rating} size="text-xs" />
                      <span className="text-[11px] text-muted2">{service.avg_rating} ({service.review_count})</span>
                    </div>
                  )}
                  <div className="text-xs text-muted2 mb-2">{service.title} - {service.city}</div>
                  <div className="text-[13px] text-muted2 mb-3">{service.description}</div>
                  <div className="flex gap-2 flex-wrap">
                    {(service.plan === "premium" || service.plan === "premier") && <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-400 font-bold">{service.plan === "premier" ? "Premier" : "Premium"}</span>}
                    {service.emergency && <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 font-bold">Emergency</span>}
                    {service.profiles?.is_verified && <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-bold">✓ Verified</span>}
                    {service.respondsQuickly && <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 font-bold">⚡ Responds Quickly</span>}
                    {service.espanol && <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 font-bold">Se habla espanol</span>}
                    {service.price_from && <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 font-bold">From ${service.price_from}</span>}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </main>
  );
}
