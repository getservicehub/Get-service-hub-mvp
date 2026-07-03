"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/directory?q=${encodeURIComponent(query.trim())}`);
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
            placeholder="🔍  What service do you need?"
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
            Search
          </button>
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