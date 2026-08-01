"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { CategoryIcon } from "@/lib/services/categoryIcons";
import StarRating from "@/components/ui/StarRating";

const PROMO_EN = [
  { title: "Want your business seen by thousands?", sub: "Elite spots put you at the top of your category, every day. 10 spots available per category." },
  { title: "This spot could be your brand.", sub: "Get maximum visibility on GetServiHub's homepage, seen by every visitor." },
  { title: "Be one of the first Elite Partners.", sub: "Limited to 10 businesses per category. Claim your spot before they're gone." },
];

const PROMO_ES = [
  { title: "¿Quieres que miles vean tu negocio?", sub: "Los espacios Elite te ponen hasta arriba en tu categoría, todos los días. 10 espacios disponibles por categoría." },
  { title: "Este espacio podría ser tu marca.", sub: "Obtén máxima visibilidad en la página principal de GetServiHub, vista por cada visitante." },
  { title: "Se de los primeros Elite Partners.", sub: "Limitado a 10 negocios por categoría. Reclama tu espacio antes de que se agoten." },
];

type EliteProvider = {
  provider_id: string;
  service_id: string;
  image_url: string | null;
  categoryName: string;
  name: string;
  city: string;
  phone: string | null;
  avgRating: number | null;
  reviewCount: number;
};

export default function SponsorBanner() {
  const { language, t } = useLanguage();
  const [slideIndex, setSlideIndex] = useState(0);
  const [ctaLink, setCtaLink] = useState("/register");
  const [eliteProviders, setEliteProviders] = useState<EliteProvider[]>([]);
  const [loaded, setLoaded] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("services")
      .select("id, provider_id, image_url, city, categories(name), profiles(full_name, business_name, phone)")
      .eq("plan", "premier")
      .eq("is_active", true)
      .limit(6)
      .then(async ({ data }) => {
        if (data && data.length > 0) {
          const serviceIds = data.map((s: any) => s.id);
          const { data: ratings } = await supabase.from("service_ratings").select("service_id, avg_rating, review_count").in("service_id", serviceIds);

          const providers = data.map((s: any) => {
            const rating = ratings?.find((r) => r.service_id === s.id);
            return {
              provider_id: s.provider_id,
              service_id: s.id,
              image_url: s.image_url,
              categoryName: s.categories?.name || "",
              name: s.profiles?.business_name || s.profiles?.full_name || "Elite Partner",
              city: s.city,
              phone: s.profiles?.phone || null,
              avgRating: rating?.avg_rating || null,
              reviewCount: rating?.review_count || 0,
            };
          });
          setEliteProviders(providers);
        }
        setLoaded(true);
      });

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase.from("services").select("id").eq("provider_id", data.user.id).limit(1).maybeSingle().then(({ data: svc }) => {
          if (svc) setCtaLink("/dashboard/upgrade");
        });
      }
    });
  }, []);

  const promoSlides = language === "es" ? PROMO_ES : PROMO_EN;
  const totalSlides = promoSlides.length + eliteProviders.length;

  useEffect(() => {
    if (totalSlides === 0) return;
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  if (!loaded) return null;

  const isPromoSlide = slideIndex < promoSlides.length;
  const currentPromo = isPromoSlide ? promoSlides[slideIndex] : null;
  const currentElite = !isPromoSlide ? eliteProviders[slideIndex - promoSlides.length] : null;

  const telLink = currentElite?.phone ? "tel:" + currentElite.phone.replace(/\D/g, "") : null;
  const waLink = currentElite?.phone ? "https://wa.me/1" + currentElite.phone.replace(/\D/g, "") : null;

  return (
    <div className="max-w-[1140px] mx-auto px-5 py-6">
      <div className="relative bg-gradient-to-br from-[#0D1A2E] via-[#0D1A2E] to-[#1a1206] border border-amber-400/30 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(245,158,11,.08)]">
        <div className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(245,158,11,.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute top-4 left-4 flex items-center gap-1.5 text-[10px] font-bold tracking-[1.5px] uppercase text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-full z-10">
          ⭐ {currentElite ? "Elite Partner" : "Sponsored"}
        </div>

        {currentElite ? (
          <div className="relative flex flex-col md:flex-row items-center gap-6 p-8 md:p-10 min-h-[180px]">
            <Link href={`/provider/${currentElite.provider_id}`} className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-card border-2 border-amber-400/30 flex items-center justify-center flex-shrink-0 text-amber-400">
              {currentElite.image_url ? (
                <img src={currentElite.image_url} alt={currentElite.name} className="w-full h-full object-cover" />
              ) : (
                <CategoryIcon name={currentElite.categoryName} className="w-12 h-12" />
              )}
            </Link>

            <div className="hidden md:block w-px h-20 bg-amber-400/20" />

            <div className="flex-1 text-center md:text-left transition-opacity duration-500" key={slideIndex}>
              <Link href={`/provider/${currentElite.provider_id}`} className="text-2xl md:text-3xl font-black mb-1.5 leading-tight hover:text-amber-400 transition-colors block">{currentElite.name}</Link>
              <div className="text-sm text-muted2 mb-2">{currentElite.categoryName} - {currentElite.city}</div>
              {currentElite.avgRating && (
                <div className="flex items-center gap-1.5 justify-center md:justify-start">
                  <StarRating rating={currentElite.avgRating} size="text-xs" />
                  <span className="text-xs text-muted2">{currentElite.avgRating} ({currentElite.reviewCount})</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 flex-shrink-0">
              {telLink && <a href={telLink} className="px-4 py-3 rounded-lg text-xs font-bold bg-red-500 text-white">Call</a>}
              {waLink && <a href={waLink} target="_blank" className="px-4 py-3 rounded-lg text-xs font-bold bg-green-500 text-white">WhatsApp</a>}
              <Link href={`/provider/${currentElite.provider_id}`} className="px-4 py-3 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 text-[#1a1206]">Profile</Link>
            </div>
          </div>
        ) : (
          <div className="relative flex flex-col md:flex-row items-center gap-8 p-8 md:p-10 min-h-[180px]">
            <div className="flex-shrink-0">
              <Image src="/logo-full.png" alt="GetServiHub" width={220} height={110} className="h-24 md:h-28 w-auto" />
            </div>

            <div className="hidden md:block w-px h-20 bg-amber-400/20" />

            <div className="flex-1 text-center md:text-left transition-opacity duration-500" key={slideIndex}>
              <div className="text-2xl md:text-3xl font-black mb-2 leading-tight">{currentPromo?.title}</div>
              <div className="text-sm text-muted2 max-w-[440px]">{currentPromo?.sub}</div>
            </div>

            <Link href={ctaLink} className="flex-shrink-0 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-[#1a1206] font-black text-sm whitespace-nowrap hover:opacity-90 hover:scale-105 transition-all shadow-lg">
              {t("sponsor_cta")} →
            </Link>
          </div>
        )}

        <div className="relative flex justify-center gap-1.5 pb-5">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIndex(i)}
              className={i === slideIndex ? "w-6 h-1.5 rounded-full bg-amber-400 transition-all" : "w-1.5 h-1.5 rounded-full bg-white/40 transition-all"}
            />
          ))}
        </div>

        <div className="relative text-center text-[11px] text-amber-400/60 pb-4">{t("sponsor_disclaimer")}</div>
      </div>
    </div>
  );
}
