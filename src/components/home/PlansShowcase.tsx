"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const PLANS_EN = [
  { name: "Basic", price: "Free", features: ["Business profile", "Search visibility", "Customer reviews"], color: "border-white/10" },
  { name: "Pro", price: "$19", features: ["Everything in Basic", "Featured badge", "Priority placement"], color: "border-cyan-400/30" },
  { name: "Plus", price: "$39", features: ["Everything in Pro", "Weekly rotation in Find", "Top visibility"], color: "border-blue-400/30" },
  { name: "Elite", price: "$99", features: ["Everything in Plus", "10 spots per category", "Maximum exclusivity"], color: "border-amber-400/30" },
];

const PLANS_ES = [
  { name: "Basic", price: "Gratis", features: ["Perfil de negocio", "Visibilidad en busqueda", "Resenas de clientes"], color: "border-white/10" },
  { name: "Pro", price: "$19", features: ["Todo en Basic", "Insignia destacada", "Prioridad de posicion"], color: "border-cyan-400/30" },
  { name: "Plus", price: "$39", features: ["Todo en Pro", "Rotacion semanal en Find", "Maxima visibilidad"], color: "border-blue-400/30" },
  { name: "Elite", price: "$99", features: ["Todo en Plus", "10 espacios por categoria", "Maxima exclusividad"], color: "border-amber-400/30" },
];

export default function PlansShowcase() {
  const { language } = useLanguage();
  const [ctaLink, setCtaLink] = useState("/register");
  const supabase = createClient();

  const plans = language === "es" ? PLANS_ES : PLANS_EN;

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase.from("services").select("id").eq("provider_id", data.user.id).limit(1).maybeSingle().then(({ data: svc }) => {
          setCtaLink(svc ? "/dashboard/upgrade" : "/dashboard/new-service");
        });
      }
    });
  }, []);

  return (
    <section className="py-16 px-5">
      <div className="max-w-[1140px] mx-auto">
        <div className="text-xs font-bold tracking-[2px] uppercase text-cyan-400 mb-3 text-center">
          {language === "es" ? "Para Profesionales" : "For Professionals"}
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">
          {language === "es" ? "Empieza gratis. Crece cuando estes listo." : "Start free. Grow when you're ready."}
        </h2>
        <p className="text-base text-muted2 max-w-[540px] mx-auto text-center mb-10">
          {language === "es" ? "Sin comision jamas. Elige el nivel de visibilidad que necesitas." : "No commission, ever. Choose the visibility level that fits your business."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <div key={plan.name} className={"bg-card border-2 " + plan.color + " rounded-2xl p-5"}>
              <div className="text-base font-extrabold mb-1">{plan.name}</div>
              <div className="text-2xl font-black mb-3">{plan.price}<span className="text-xs font-medium text-muted2">{plan.price !== "Free" && plan.price !== "Gratis" ? "/mo" : ""}</span></div>
              <ul className="space-y-1.5">
                {plan.features.map((f) => (
                  <li key={f} className="text-[11px] text-muted2 flex items-start gap-1.5">
                    <span className="text-green-400 flex-shrink-0">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href={ctaLink} className="inline-flex items-center gap-1.5 px-8 py-3.5 rounded-lg gradient-bg text-white font-semibold text-sm hover:opacity-90 transition-all">
            {language === "es" ? "Registra Tu Negocio Gratis" : "List Your Business Free"} →
          </Link>
        </div>
      </div>
    </section>
  );
}
