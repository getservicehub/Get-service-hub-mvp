"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const SLIDES_EN = [
  { title: "Want your business seen by thousands?", sub: "Premier spots put you at the top of every category, every day. Only 3 spots available in San Diego." },
  { title: "This spot could be your brand.", sub: "Get maximum visibility on GetServiHub's homepage, seen by every visitor." },
  { title: "Be one of the first Premier Partners.", sub: "Limited to 3 businesses total. Claim your spot before they're gone." },
];

const SLIDES_ES = [
  { title: "¿Quieres que miles vean tu negocio?", sub: "Los espacios Premier te ponen hasta arriba en cada categoría, todos los días. Solo 3 espacios disponibles en San Diego." },
  { title: "Este espacio podría ser tu marca.", sub: "Obtén máxima visibilidad en la página principal de GetServiHub, vista por cada visitante." },
  { title: "Se de los primeros Premier Partners.", sub: "Limitado a 3 negocios en total. Reclama tu espacio antes de que se agoten." },
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
      <div className="relative bg-card border border-amber-400/20 rounded-2xl overflow-hidden">
        <div className="absolute top-3 left-3 text-[10px] font-bold tracking-[1.5px] uppercase text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full z-10">
          Sponsored
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8 min-h-[140px]">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center flex-shrink-0 p-2">
            <Image src="/logo-icon.png" alt="GetServiHub" width={48} height={48} className="w-full h-full object-contain" />
          </div>

          <div className="flex-1 text-center md:text-left transition-opacity duration-500" key={slideIndex}>
            <div className="text-lg font-extrabold mb-1">{current.title}</div>
            <div className="text-sm text-muted2">{current.sub}</div>
          </div>

          <Link href={ctaLink} className="flex-shrink-0 px-6 py-3 rounded-lg gradient-bg text-white font-bold text-sm whitespace-nowrap hover:opacity-90 transition-all">
            {t("sponsor_cta")} →
          </Link>
        </div>

        <div className="flex justify-center gap-1.5 pb-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIndex(i)}
              className={i === slideIndex ? "w-5 h-1.5 rounded-full bg-amber-400 transition-all" : "w-1.5 h-1.5 rounded-full bg-white/20 transition-all"}
            />
          ))}
        </div>

        <div className="text-center text-[11px] text-cyan-400/70 pb-3">{t("sponsor_disclaimer")}</div>
      </div>
    </div>
  );
}
