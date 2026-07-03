"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type Service = {
  id: string;
  title: string;
  description: string;
  city: string;
  price_from: number | null;
  emergency: boolean;
  espanol: boolean;
  image_url: string | null;
  profiles: { full_name: string; business_name: string } | null;
  categories: { name: string; icon: string } | null;
};

type Category = { id: string; name: string; icon: string };

export default function DirectoryPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.from("categories").select("id, name, icon").then(({ data }) => {
      if (data) setCategories(data);
    });

    supabase
      .from("services")
      .select("id, title, description, city, price_from, emergency, espanol, image_url, profiles(full_name, business_name), categories(name, icon)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (data) setServices(data as unknown as Service[]);
        if (error) console.log(error);
        setLoading(false);
      });
  }, [supabase]);

  const filtered = filter === "All" ? services : services.filter((s) => s.categories?.name === filter);return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[1140px] mx-auto">
        <div className="text-xs font-bold tracking-[2px] uppercase text-cyan-400 mb-3">Directory</div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8">Browse All Pros</h1>

        <div className="flex flex-wrap gap-2.5 mb-8">
          <button onClick={() => setFilter("All")} className={filter === "All" ? "px-4.5 py-2 rounded-full text-[13px] font-semibold gradient-bg text-white" : "px-4.5 py-2 rounded-full text-[13px] font-semibold border border-white/20 text-muted2"}>All</button>
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setFilter(cat.name)} className={filter === cat.name ? "px-4.5 py-2 rounded-full text-[13px] font-semibold gradient-bg text-white" : "px-4.5 py-2 rounded-full text-[13px] font-semibold border border-white/20 text-muted2"}>
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {loading && <div className="text-muted2 text-sm">Loading services...</div>}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📭</div>
            <div className="text-muted2 text-sm">No services found in this category yet.</div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((service) => {
            const hasImage = service.image_url !== null && service.image_url !== "";
            return (
              <a key={service.id} href={`/service/${service.id}`} className="block bg-card border border-white/[.08] rounded-[20px] overflow-hidden hover:border-white/20 hover:-translate-y-1 transition-all">
                <div className="w-full h-[160px] flex items-center justify-center text-5xl bg-gradient-to-br from-[#0A1628] to-[#0D1A2E] overflow-hidden">
                  {hasImage && <img src={service.image_url as string} alt={service.title} className="w-full h-full object-cover" />}
                  {!hasImage && <span>{service.categories?.icon || "⚡"}</span>}
                </div>
                <div className="p-4">
                  <div className="text-[15px] font-extrabold mb-1">{service.profiles?.business_name || service.profiles?.full_name || "Provider"}</div>
                  <div className="text-xs text-muted2 mb-2">{service.title} - {service.city}</div>
                  <div className="text-[13px] text-muted2 mb-3">{service.description}</div>
                  <div className="flex gap-2 flex-wrap">
                    {service.emergency && <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 font-bold">Emergency</span>}
                    {service.espanol && <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 font-bold">Se habla espanol</span>}
                    {service.price_from && <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 font-bold">From ${service.price_from}</span>}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </main>
  );
}