"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { createClient } from "@/lib/supabase/client";
import { getProviderName, type ServiceCard } from "@/lib/services/queries";
import StarRating from "@/components/ui/StarRating";
import { CategoryIcon } from "@/lib/services/categoryIcons";
import { Search, Heart, ArrowRight, Rocket, Briefcase } from "lucide-react";

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
  const { t } = useLanguage();
  const [filter, setFilter] = useState(initialFilter);
  const [cityFilter, setCityFilter] = useState(initialCity);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "rating">("recent");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      if (data.user) {
        supabase.from("favorites").select("service_id").eq("client_id", data.user.id).then(({ data: favs }) => {
          if (favs) setFavorites(favs.map((f) => f.service_id));
        });
      }
    });
  }, []);

  const toggleFavorite = async (e: React.MouseEvent, serviceId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) {
      window.location.href = "/login";
      return;
    }
    if (favorites.includes(serviceId)) {
      await supabase.from("favorites").delete().eq("client_id", userId).eq("service_id", serviceId);
      setFavorites((prev) => prev.filter((id) => id !== serviceId));
    } else {
      const { error } = await supabase.from("favorites").insert({ client_id: userId, service_id: serviceId });
      if (!error || error.code === "23505") {
        setFavorites((prev) => [...prev, serviceId]);
      }
    }
  };

  const filtered = initialServices
    .filter((s) => {
      const matchesCategory = filter === "All" || s.categories?.name === filter;
      const matchesCity = cityFilter === "" || s.city === cityFilter;
      const q = query.trim().toLowerCase();
      const matchesQuery = q === "" || s.title.toLowerCase().includes(q) || getProviderName(s).toLowerCase().includes(q) || s.categories?.name.toLowerCase().includes(q);
      return matchesCategory && matchesCity && matchesQuery;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return (b.avg_rating || 0) - (a.avg_rating || 0);
      return 0;
    });

  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[1200px] mx-auto">

        {sponsored.length > 0 && (
          <div className="mb-10">
            <div className="text-[10px] font-bold tracking-[2px] uppercase text-amber-400 mb-4">Sponsored</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sponsored.slice(0, 2).map((s) => {
                const hasImage = s.image_url !== null && s.image_url !== "";
                return (
                  <a key={s.id} href={`/service/${s.id}`} className="block bg-card border border-amber-400/20 rounded-2xl overflow-hidden hover:border-amber-400/40 transition-all">
                    <div className="w-full h-[110px] flex items-center justify-center text-cyan-400 bg-gradient-to-br from-[#0A1628] to-[#0D1A2E] overflow-hidden">
                      {hasImage && <img src={s.image_url as string} alt={s.title} className="w-full h-full object-cover" />}
                      {!hasImage && <CategoryIcon name={s.categories?.name || ""} className="w-8 h-8" />}
                    </div>
                    <div className="p-3.5 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-[13px] font-bold truncate">{getProviderName(s)}</div>
                        <div className="text-[11px] text-muted2 truncate">{s.title}</div>
                      </div>
                      <span className="flex-shrink-0 text-[11px] font-bold text-amber-400 border border-amber-400/30 rounded-lg px-2.5 py-1.5 whitespace-nowrap">Ver Perfil →</span>
                    </div>
                  </a>
                );
              })}
              <div className="bg-gradient-to-br from-[#0A1628] to-[#1a1206] border border-amber-400/20 rounded-2xl p-5 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full border border-amber-400/40 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <Rocket className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold mb-0.5">Haz crecer tu negocio</div>
                  <div className="text-[11px] text-muted2 mb-2">Patrocina tu empresa y llega a más clientes.</div>
                  <a href="/dashboard/upgrade" className="text-[11px] font-bold text-amber-400 hover:underline">Promocionar mi negocio →</a>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs font-bold tracking-[2px] uppercase text-cyan-400 mb-3">Find Local Pros</div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-6">Explora <span className="text-cyan-400">Todos</span> los Profesionales</h1>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="px-4 py-3 bg-card border border-white/20 rounded-lg text-sm text-white md:max-w-[220px]">
            <option value="" className="bg-bg2">📍 {t("find_all_cities")}</option>
            {cities.map((city) => (
              <option key={city} value={city} className="bg-bg2">{city}</option>
            ))}
          </select>
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted2 absolute left-4 top-1/2 -translate-y-1/2" />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por servicio o profesional..." className="w-full pl-11 pr-4 py-3 bg-card border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setFilter("All")} className={filter === "All" ? "px-4 py-1.5 rounded-full text-[12px] font-semibold gradient-bg text-white" : "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-semibold border border-white/15 text-muted2 hover:border-cyan-400/40 transition-colors"}>{t("find_all")}</button>
          {initialCategories.map((cat) => (
            <button key={cat.id} onClick={() => setFilter(cat.name)} className={filter === cat.name ? "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-semibold gradient-bg text-white" : "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-semibold border border-white/15 text-muted2 hover:border-cyan-400/40 transition-colors"}>
              <CategoryIcon name={cat.name} className={filter === cat.name ? "w-3.5 h-3.5 text-white" : "w-3.5 h-3.5 text-cyan-400"} /> {cat.name}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-muted2">Mostrando <span className="text-white font-bold">{filtered.length}</span> profesionales</div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted2 hidden sm:inline">Ordenar por</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "recent" | "rating")} className="px-3 py-2 bg-card border border-white/20 rounded-lg text-xs text-white">
              <option value="recent" className="bg-bg2">Más recientes</option>
              <option value="rating" className="bg-bg2">Mejor calificados</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📭</div>
            <div className="text-muted2 text-sm">{t("find_no_results")}</div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((service) => {
            const hasImage = service.image_url !== null && service.image_url !== "";
            const isFavorited = favorites.includes(service.id);
            return (
              <a key={service.id} href={`/service/${service.id}`} className="group block bg-card border border-white/[.08] rounded-2xl overflow-hidden hover:border-cyan-400/30 hover:-translate-y-1 transition-all duration-300">
                <div className="relative w-full h-[140px] overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-cyan-400 bg-gradient-to-br from-[#0A1628] to-[#0D1A2E]">
                    {hasImage && <img src={service.image_url as string} alt={service.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />}
                    {!hasImage && <CategoryIcon name={service.categories?.name || ""} className="w-10 h-10" />}
                  </div>
                  <button onClick={(e) => toggleFavorite(e, service.id)} className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-[#0A1628]/80 backdrop-blur-sm flex items-center justify-center">
                    <Heart className={isFavorited ? "w-3.5 h-3.5 fill-red-500 text-red-500" : "w-3.5 h-3.5 text-white"} />
                  </button>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <a href={`/provider/${service.provider_id}`} onClick={(e) => e.stopPropagation()} className="text-[14px] font-extrabold hover:text-cyan-400 transition-colors inline-flex items-center gap-1">
                      {getProviderName(service)}
                      {service.profiles?.is_verified && <span className="text-blue-400 text-[11px]">✓</span>}
                    </a>
                  </div>
                  <div className="text-[11px] text-muted2 mb-1.5">{service.categories?.name} - {service.city}</div>
                  {service.avg_rating && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <StarRating rating={service.avg_rating} size="text-xs" />
                      <span className="text-[11px] text-muted2">{service.avg_rating} ({service.review_count})</span>
                    </div>
                  )}
                  <div className="text-[12px] text-muted2 mb-3 line-clamp-2">{service.description}</div>
                  <div className="flex gap-1.5 flex-wrap mb-3">
                    {(service.plan === "premium" || service.plan === "premier") && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-400 font-bold">{service.plan === "premier" ? "Elite" : "Plus"}</span>}
                    {service.emergency && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 font-bold">24/7</span>}
                    {service.respondsQuickly && <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 font-bold">⚡ Rápida</span>}
                    {service.espanol && <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 font-bold">Español</span>}
                    {service.price_from && <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[.08] text-white font-bold">Desde ${service.price_from}</span>}
                  </div>
                  <div className="flex items-center gap-1 text-[12px] font-bold text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Ver perfil <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        <div className="mt-12 bg-card border border-white/[.08] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-cyan-400/10 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold">¿No encuentras lo que buscas?</div>
              <div className="text-xs text-muted2">Explora todas nuestras categorías disponibles.</div>
            </div>
          </div>
          <a href="/find" className="px-5 py-2.5 rounded-lg gradient-bg text-white font-semibold text-sm whitespace-nowrap">Ver Todas las Categorías →</a>
        </div>
      </div>
    </main>
  );
}
