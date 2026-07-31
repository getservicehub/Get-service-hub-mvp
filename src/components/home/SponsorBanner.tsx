"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const SLIDES_EN = [
  { title: "Want your business seen by thousands?", sub: "Elite spots put you at the top of your category, every day. 10 spots available per category." },
  { title: "This spot could be your brand.", sub: "Get maximum visibility on GetServiHub's homepage, seen by every visitor." },
  { title: "Be one of the first Elite Partners.", sub: "Limited to 10 businesses per category. Claim your spot before they're gone." },
];

const SLIDES_ES = [
  { title: "¿Quieres que miles vean tu negocio?", sub: "Los espacios Elite te ponen hasta arriba en tu categoría, todos los días. 10 espacios disponibles por categoría." },
  { title: "Este espacio podría ser tu marca.", sub: "Obtén máxima visibilidad en la página principal de GetServiHub, vista por cada visitante." },
  { title: "Se de los primeros Elite Partners.", sub: "Limitado a 10 negocios por categoría. Reclama tu espacio antes de que se agoten." },
];

export default function SponsorBanner() {
  const { language, t } = useLanguage();
  const [slideIndex, setSlideIndex] = useState(0);
  const [ctaLink, setCtaLink] = useState("/register");
  const supabase = createClient();

  const slides = language === "es" ? SLIDES_ES : SLIDES_EN;

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase.from("services").select("id").eq("provider_id", data.user.id).limit(1).maybeSingle().then(({ data: svc }) => {
          if (svc) setCtaLink("/dashboard/upgrade");
        });
      }
    });
  }, []);

  const current = slides[slideIndex];

  return (
    <div className="max-w-[1140px] mx-auto px-5 py-6">
      <div className="relative bg-gradient-to-br from-[#0D1A2E] via-[#0D1A2E] to-[#1a1206] border border-amber-400/30 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(245,158,11,.08)]">
        <div className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(245,158,11,.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute top-4 left-4 flex items-center gap-1.5 text-[10px] font-bold tracking-[1.5px] uppercase text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-full z-10">
          ⭐ Sponsored
        </div>

        <div className="relative flex flex-col md:flex-row items-center gap-8 p-8 md:p-10 min-h-[180px]">
          <div className="flex-shrink-0">
            <Image src="/logo-full.png" alt="GetServiHub" width={220} height={110} className="h-24 md:h-28 w-auto" />
          </div>

          <div className="hidden md:block w-px h-20 bg-amber-400/20" />

          <div className="flex-1 text-center md:text-left transition-opacity duration-500" key={slideIndex}>
            <div className="text-2xl md:text-3xl font-black mb-2 leading-tight">{current.title}</div>
            <div className="text-sm text-muted2 max-w-[440px]">{current.sub}</div>
          </div>

          <Link href={ctaLink} className="flex-shrink-0 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-[#1a1206] font-black text-sm whitespace-nowrap hover:opacity-90 hover:scale-105 transition-all shadow-lg">
            {t("sponsor_cta")} →
          </Link>
        </div>

        <div className="relative flex justify-center gap-1.5 pb-5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIndex(i)}
              className={i === slideIndex ? "w-6 h-1.5 rounded-full bg-amber-400 transition-all" : "w-1.5 h-1.5 rounded-full bg-white/20 transition-all"}
            />
          ))}
        </div>

        <div className="relative text-center text-[11px] text-amber-400/60 pb-4">{t("sponsor_disclaimer")}</div>
      </div>
    </div>
  );
}
