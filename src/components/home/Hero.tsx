"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { matchCategory } from "@/lib/services/keywords";
import { getCities } from "@/lib/services/queries";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { CategoryIcon } from "@/lib/services/categoryIcons";
import { Languages, PiggyBank, MapPin, Scale, Search, TrendingUp, ShieldCheck, UserCheck, MessageSquare } from "lucide-react";

type Category = { id: string; name: string; icon: string };

export default function Hero() {
  const { t } = useLanguage();
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [serviceCount, setServiceCount] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.from("categories").select("id, name, icon").then(({ data }) => {
      if (data) setCategories(data);
    });

    getCities().then((data) => setCities(data));

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        supabase.from("profiles").select("role, full_name, business_name").eq("id", data.user.id).single().then(({ data: profile }) => {
          if (profile) {
            setRole(profile.role);
            setDisplayName(profile.business_name || profile.full_name || "");
          }
        });

        supabase.from("services").select("id", { count: "exact", head: true }).eq("provider_id", data.user.id).then(({ count }) => {
          setServiceCount(count || 0);
        });
      }
    });
  }, [supabase]);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (query.trim()) {
      const matchedCategory = matchCategory(query);
      if (matchedCategory) {
        params.set("category", matchedCategory);
      } else {
        params.set("q", query.trim());
      }
    }

    if (selectedCity) {
      params.set("city", selectedCity);
    }

    router.push(`/find?${params.toString()}`);
  };

  if (!user) {
    return (
      <section className="relative overflow-hidden pt-[120px] pb-20 px-5">
        <div className="absolute inset-0 z-0">
          <Image src="/hero-bg.jpg" alt="San Diego skyline" fill priority className="object-cover" style={{ objectPosition: "75% 30%" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060D1A] via-[#060D1A]/85 via-35% to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060D1A]/70 via-transparent to-transparent" />
          <div className="absolute top-1/4 right-[10%] w-[550px] h-[550px] bg-[radial-gradient(circle,rgba(56,141,248,.40)_0%,rgba(56,141,248,.15)_45%,transparent_75%)] pointer-events-none" />
        </div>
        <div className="relative z-10 max-w-[900px] mx-auto">
          <div className="max-w-[640px]">
            <div className="inline-flex items-center gap-2 bg-cyan-400/[.08] border border-cyan-400/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-cyan-400 mb-6">
              <MapPin className="w-3.5 h-3.5" /> {t("hero_eyebrow")}
            </div>

            <h1 className="text-4xl md:text-6xl font-black leading-[1.1] mb-5">
              {t("hero_title_1")} <span className="gradient-text">{t("hero_title_2")}</span> {t("hero_title_3")}
            </h1>

            <p className="text-lg text-muted2 leading-relaxed mb-9">
              {t("hero_sub")}
            </p>

            <div className="flex gap-3 flex-wrap">
              <Link href="/find" className="inline-flex items-center gap-1.5 text-base font-semibold px-7 py-3.5 rounded-lg gradient-bg text-white hover:opacity-90 transition-all"><Search className="w-4 h-4" /> {t("hero_cta_find")}</Link>
              <Link href="/register" className="inline-flex items-center gap-1.5 text-base font-semibold px-7 py-3.5 rounded-lg border border-cyan-400/20 text-cyan-400 hover:bg-cyan-400/[.08] transition-all">{t("hero_cta_list")} →</Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-12 pt-9 border-t border-white/[.08]">
              <div><PiggyBank className="w-5 h-5 mx-auto text-cyan-400" /><div className="text-xs font-bold mt-1.5">{t("hero_value_1_title")}</div><div className="text-[11px] text-muted2">{t("hero_value_1_sub")}</div></div>
              <div><ShieldCheck className="w-5 h-5 mx-auto text-cyan-400" /><div className="text-xs font-bold mt-1.5">{t("hero_value_2_title")}</div><div className="text-[11px] text-muted2">{t("hero_value_2_sub")}</div></div>
              <div><MapPin className="w-5 h-5 mx-auto text-cyan-400" /><div className="text-xs font-bold mt-1.5">{t("hero_value_3_title")}</div><div className="text-[11px] text-muted2">{t("hero_value_3_sub")}</div></div>
              <div><Scale className="w-5 h-5 mx-auto text-cyan-400" /><div className="text-xs font-bold mt-1.5">{t("hero_value_4_title")}</div><div className="text-[11px] text-muted2">{t("hero_value_4_sub")}</div></div>
            </div>
          </div>
          <div className="hidden lg:flex flex-col gap-5 absolute -bottom-10 right-0 z-20 bg-[#0A1628]/90 backdrop-blur-sm border border-white/10 rounded-2xl p-6 w-[260px]">
            <div className="flex items-start gap-2.5">
              <Languages className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-cyan-400">{t("hero_trust_bilingual_title")}</div>
                <div className="text-[11px] text-muted2">{t("hero_trust_bilingual_sub")}</div>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <UserCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-cyan-400">{t("hero_trust_verified_title")}</div>
                <div className="text-[11px] text-muted2">{t("hero_trust_verified_sub")}</div>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-cyan-400">{t("hero_trust_built_title")}</div>
                <div className="text-[11px] text-muted2">{t("hero_trust_built_sub")}</div>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-cyan-400">{t("hero_trust_local_title")}</div>
                <div className="text-[11px] text-muted2">{t("hero_trust_local_sub")}</div>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <MessageSquare className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-cyan-400">{t("hero_trust_reviews_title")}</div>
                <div className="text-[11px] text-muted2">{t("hero_trust_reviews_sub")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (role === "provider") {
    return (
      <section className="relative overflow-hidden pt-[120px] pb-16 px-5">
        <div className="absolute -top-[100px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse,rgba(0,87,231,.18)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative max-w-[1140px] mx-auto">
          <div className="inline-flex items-center gap-2 bg-cyan-400/[.08] border border-cyan-400/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-cyan-400 mb-5">
            🔧 {t("hero_provider_dashboard")}
          </div>

          <h1 className="text-3xl md:text-5xl font-black leading-[1.1] mb-3">
            {t("hero_welcome")}, <span className="gradient-text">{displayName}</span>
          </h1>

          <p className="text-base text-muted2 mb-8">{t("hero_provider_sub")}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card border border-white/[.08] rounded-2xl p-5">
              <div className="text-3xl font-extrabold gradient-text">{serviceCount}</div>
              <div className="text-xs text-muted2 mt-1">{t("stat_active_services")}</div>
            </div>
            <div className="bg-card border border-white/[.08] rounded-2xl p-5">
              <div className="text-3xl font-extrabold gradient-text">$0</div>
              <div className="text-xs text-muted2 mt-1">{t("stat_commission_paid")}</div>
            </div>
            <div className="bg-card border border-white/[.08] rounded-2xl p-5">
              <div className="text-3xl font-extrabold gradient-text">Basic</div>
              <div className="text-xs text-muted2 mt-1">{t("stat_current_plan")}</div>
            </div>
            <div className="bg-card border border-white/[.08] rounded-2xl p-5">
              <div className="text-3xl font-extrabold gradient-text">SD</div>
              <div className="text-xs text-muted2 mt-1">San Diego</div>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Link href="/dashboard/new-service" className="inline-flex items-center gap-1.5 text-base font-semibold px-7 py-3.5 rounded-lg gradient-bg text-white hover:opacity-90 transition-all">+ {t("hero_cta_publish")}</Link>
            <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-base font-semibold px-7 py-3.5 rounded-lg border border-cyan-400/20 text-cyan-400 hover:bg-cyan-400/[.08] transition-all">{t("hero_cta_dashboard")} →</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden pt-[120px] pb-16 px-5">
      <div className="absolute -top-[100px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse,rgba(0,87,231,.18)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative max-w-[1140px] mx-auto">
        <div className="inline-flex items-center gap-2 bg-cyan-400/[.08] border border-cyan-400/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-cyan-400 mb-5">
          👋 {t("hero_welcome")}{displayName ? ", " + displayName : ""}
        </div>

        <h1 className="text-3xl md:text-5xl font-black leading-[1.1] mb-8">
          {t("hero_what_need")}
        </h1>

        <div className="flex flex-col sm:flex-row bg-card border border-white/[.14] rounded-xl overflow-hidden max-w-[700px] mb-3">
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder={t("search_placeholder")} className="flex-1 bg-transparent border-none outline-none px-5 py-4 text-[15px] text-white placeholder:text-muted2" />
          <div className="hidden sm:block w-px bg-white/[.14]" />
          <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="bg-transparent border-none outline-none px-5 py-4 text-[14px] text-white max-w-[180px]">
            <option value="" className="bg-bg2">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city} className="bg-bg2">{city}</option>
            ))}
          </select>
          <button onClick={handleSearch} className="gradient-bg text-white font-semibold px-7 py-4 hover:opacity-90 transition-all">{t("search_button")}</button>
        </div>

        <div className="text-xs text-muted2 mb-8">
          {t("search_example")} <span className="text-cyan-400">"{t("search_example_text")}"</span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/find?category=${encodeURIComponent(cat.name)}`} className="flex-shrink-0 flex items-center gap-2 bg-card border border-white/[.08] rounded-full px-4 py-2.5 hover:border-cyan-400/40 transition-all">
              <CategoryIcon name={cat.name} className="w-4 h-4" />
              <span className="text-[13px] font-semibold whitespace-nowrap">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
