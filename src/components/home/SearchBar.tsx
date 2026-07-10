"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { matchCategory } from "@/lib/services/keywords";

const tags = [
  { label: "🔧 Mobile Mechanic", value: "Mobile Mechanic" },
  { label: "🚗 Tow Service", value: "Tow Service" },
  { label: "✨ Auto Detailing", value: "Auto Detailing" },
  { label: "🌿 Landscaping", value: "Landscaping" },
  { label: "🏠 House Cleaning", value: "Cleaning" },
  { label: "🎨 Painting", value: "Painting" },
  { label: "🔨 Remodeling", value: "Remodeling" },
];

export default function SearchBar() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (query.trim()) {
      const matchedCategory = matchCategory(query);
      if (matchedCategory) {
        router.push(`/directory?category=${encodeURIComponent(matchedCategory)}`);
      } else {
        router.push(`/directory?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  return (
    <div className="bg-bg2 py-10 px-5">
      <div className="max-w-[760px] mx-auto">
        <div className="flex bg-card border border-white/[.14] rounded-xl overflow-hidden">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={"🔍  " + t("search_placeholder")}
            className="flex-1 bg-transparent border-none outline-none px-5 py-4 text-[15px] text-white placeholder:text-muted2"
          />
          <div className="w-px bg-white/[.14]" />
          <input
            type="text"
            placeholder="📍 San Diego, CA"
            className="max-w-[180px] bg-transparent border-none outline-none px-5 py-4 text-[15px] text-white placeholder:text-muted2"
          />
          <button
            onClick={handleSearch}
            className="gradient-bg text-white font-semibold px-7 hover:opacity-90 transition-all"
          >
            {t("search_button")}
          </button>
        </div>

        <div className="text-xs text-muted2 mt-3 mb-1">
          {t("search_example")} <span className="text-cyan-400">"{t("search_example_text")}"</span>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag) => (
            <button
              key={tag.value}
              onClick={() => router.push(`/directory?category=${encodeURIComponent(tag.value)}`)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 border border-white/20 text-blue-300 hover:bg-blue-500/20 hover:text-cyan-400 transition-all"
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
