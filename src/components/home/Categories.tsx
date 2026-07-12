"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { CategoryIcon } from "@/lib/services/categoryIcons";

type Category = { id: string; name: string; icon: string };

export default function Categories() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.from("categories").select("id, name, icon").order("name").then(({ data }) => {
      if (data) setCategories(data);
    });
  }, [supabase]);

  return (
    <section className="py-18 px-5" id="categories">
      <div className="max-w-[1140px] mx-auto">
        <div className="text-xs font-bold tracking-[2px] uppercase text-cyan-400 mb-3">
          {t("categories_label")}
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">
          {t("categories_title")}
        </h2>
        <p className="text-base text-muted2 max-w-[540px]">
          {t("categories_sub")}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => router.push(`/directory?category=${encodeURIComponent(cat.name)}`)}
              className="bg-card border border-white/[.08] rounded-2xl p-6 text-center hover:border-white/20 hover:-translate-y-1 hover:bg-[#0D1A2E]/90 transition-all"
            >
              <div className="flex justify-center mb-3 text-cyan-400">
                <CategoryIcon name={cat.name} className="w-8 h-8" />
              </div>
              <div className="text-[13px] font-bold mb-1">{cat.name}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
