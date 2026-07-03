"use client";

import { useRouter } from "next/navigation";

const categories = [
  { icon: "🔧", name: "Mobile Mechanic", count: "48 Pros" },
  { icon: "🚛", name: "Tow Service", count: "31 Pros" },
  { icon: "✨", name: "Auto Detailing", count: "56 Pros" },
  { icon: "🛞", name: "Tire Service", count: "22 Pros" },
  { icon: "🚗", name: "Body Shop", count: "19 Pros" },
  { icon: "🌿", name: "Landscaping", count: "74 Pros" },
  { icon: "🏠", name: "Home Cleaning", count: "89 Pros" },
  { icon: "🎨", name: "Painting", count: "43 Pros" },
  { icon: "🔨", name: "Remodeling", count: "37 Pros" },
  { icon: "⚡", name: "Others", count: "120+ Pros" },
];

export default function Categories() {
  const router = useRouter();

  return (
    <section className="py-18 px-5" id="categories">
      <div className="max-w-[1140px] mx-auto">
        <div className="text-xs font-bold tracking-[2px] uppercase text-cyan-400 mb-3">
          Browse by Category
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">
          Every Service Your Home &amp; Car Needs
        </h2>
        <p className="text-base text-muted2 max-w-[540px]">
          From emergency repairs to regular maintenance — find the right pro
          in San Diego County.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-10">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() =>
                router.push(`/directory?category=${encodeURIComponent(cat.name)}`)
              }
              className="bg-card border border-white/[.08] rounded-2xl p-6 text-center hover:border-white/20 hover:-translate-y-1 hover:bg-[#0D1A2E]/90 transition-all"
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <div className="text-[13px] font-bold mb-1">{cat.name}</div>
              <div className="text-[11px] text-muted2">{cat.count}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}