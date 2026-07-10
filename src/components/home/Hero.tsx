"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { matchCategory } from "@/lib/services/keywords";
type Category = { id: string; name: string; icon: string };

export default function Hero() {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [serviceCount, setServiceCount] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.from("categories").select("id, name, icon").then(({ data }) => {
      if (data) setCategories(data);
    });

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
    if (query.trim()) {
      const matchedCategory = matchCategory(query);
      if (matchedCategory) {
        router.push(`/directory?category=${encodeURIComponent(matchedCategory)}`);
      } else {
        router.push(`/directory?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };
  if (!user) {
    return (
      <section className="relative overflow-hidden pt-[120px] pb-20 px-5">
        <div className="absolute -top-[100px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse,rgba(0,87,231,.18)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative max-w-[1140px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-cyan-400/[.08] border border-cyan-400/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-cyan-400 mb-6">
              📍 San Diego&apos;s Local Services Marketplace
            </div>

            <h1 className="text-4xl md:text-6xl font-black leading-[1.1] mb-5">
              Find Trusted <span className="gradient-text">Local Pros</span> in Your Community
            </h1>

            <p className="text-lg text-muted2 leading-relaxed mb-9">
              Connect with verified local businesses in San Diego. English &amp; Spanish. No commissions. No middlemen. Just real people doing real work.
            </p>

            <div className="flex gap-3 flex-wrap">
              <Link href="/directory" className="inline-flex items-center gap-1.5 text-base font-semibold px-7 py-3.5 rounded-lg gradient-bg text-white hover:opacity-90 transition-all">🔍 Find a Pro</Link>
              <Link href="/register" className="inline-flex items-center gap-1.5 text-base font-semibold px-7 py-3.5 rounded-lg border border-cyan-400/20 text-cyan-400 hover:bg-cyan-400/[.08] transition-all">List Your Business Free →</Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-12 pt-9 border-t border-white/[.08]">
              <div><div className="text-2xl font-extrabold gradient-text">500+</div><div className="text-xs text-muted2 mt-0.5">Verified Pros</div></div>
              <div><div className="text-2xl font-extrabold gradient-text">12K+</div><div className="text-xs text-muted2 mt-0.5">Happy Clients</div></div>
              <div><div className="text-2xl font-extrabold gradient-text">$0</div><div className="text-xs text-muted2 mt-0.5">Commission Fees</div></div>
              <div><div className="text-2xl font-extrabold gradient-text">4.9★</div><div className="text-xs text-muted2 mt-0.5">Avg. Rating</div></div>
            </div>
          </div>

          <div className="hidden md:block relative h-[480px]">
            <div className="absolute top-5 left-0 w-[210px] bg-card border border-white/10 rounded-2xl p-4 shadow-2xl">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center font-extrabold text-white flex-shrink-0">R</div>
                <div><div className="text-[13px] font-bold">Ramirez Mechanics</div><div className="text-[11px] text-muted2">Mobile Mechanic</div></div>
              </div>
              <div className="text-xs">⭐⭐⭐⭐⭐ 4.9</div>
            </div>

            <div className="absolute top-[180px] right-0 w-[210px] bg-card border border-white/10 rounded-2xl p-4 shadow-2xl">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center font-extrabold text-white flex-shrink-0">V</div>
                <div><div className="text-[13px] font-bold">Verde Landscaping</div><div className="text-[11px] text-muted2">Landscaping</div></div>
              </div>
              <div className="text-xs">⭐⭐⭐⭐⭐ 4.8</div>
            </div>

            <div className="absolute bottom-10 left-10 w-[210px] bg-card border border-white/10 rounded-2xl p-4 shadow-2xl">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-extrabold text-white flex-shrink-0">E</div>
                <div><div className="text-[13px] font-bold">Elite Auto Detail</div><div className="text-[11px] text-muted2">Auto Detailing</div></div>
              </div>
              <div className="text-xs">⭐⭐⭐⭐⭐ 4.9</div>
            </div>
          </div>
        </div>
      </section>
    );
  }if (role === "provider") {
    return (
      <section className="relative overflow-hidden pt-[120px] pb-16 px-5">
        <div className="absolute -top-[100px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse,rgba(0,87,231,.18)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative max-w-[1140px] mx-auto">
          <div className="inline-flex items-center gap-2 bg-cyan-400/[.08] border border-cyan-400/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-cyan-400 mb-5">
            🔧 Provider Dashboard
          </div>

          <h1 className="text-3xl md:text-5xl font-black leading-[1.1] mb-3">
            Welcome back, <span className="gradient-text">{displayName}</span>
          </h1>

          <p className="text-base text-muted2 mb-8">Manage your services and grow your business on GetServiHub.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card border border-white/[.08] rounded-2xl p-5">
              <div className="text-3xl font-extrabold gradient-text">{serviceCount}</div>
              <div className="text-xs text-muted2 mt-1">Active Services</div>
            </div>
            <div className="bg-card border border-white/[.08] rounded-2xl p-5">
              <div className="text-3xl font-extrabold gradient-text">$0</div>
              <div className="text-xs text-muted2 mt-1">Commission Paid</div>
            </div>
            <div className="bg-card border border-white/[.08] rounded-2xl p-5">
              <div className="text-3xl font-extrabold gradient-text">Basic</div>
              <div className="text-xs text-muted2 mt-1">Current Plan</div>
            </div>
            <div className="bg-card border border-white/[.08] rounded-2xl p-5">
              <div className="text-3xl font-extrabold gradient-text">SD</div>
              <div className="text-xs text-muted2 mt-1">San Diego</div>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Link href="/dashboard/new-service" className="inline-flex items-center gap-1.5 text-base font-semibold px-7 py-3.5 rounded-lg gradient-bg text-white hover:opacity-90 transition-all">+ Publish New Service</Link>
            <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-base font-semibold px-7 py-3.5 rounded-lg border border-cyan-400/20 text-cyan-400 hover:bg-cyan-400/[.08] transition-all">Go to Dashboard →</Link>
          </div>
        </div>
      </section>
    );
  }return (
    <section className="relative overflow-hidden pt-[120px] pb-16 px-5">
      <div className="absolute -top-[100px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse,rgba(0,87,231,.18)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative max-w-[1140px] mx-auto">
        <div className="inline-flex items-center gap-2 bg-cyan-400/[.08] border border-cyan-400/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-cyan-400 mb-5">
          👋 Welcome back{displayName ? ", " + displayName : ""}
        </div>

        <h1 className="text-3xl md:text-5xl font-black leading-[1.1] mb-8">
          What do you need <span className="gradient-text">today?</span>
        </h1>

        <div className="flex bg-card border border-white/[.14] rounded-xl overflow-hidden max-w-[600px] mb-8">
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="🔍  What service do you need?" className="flex-1 bg-transparent border-none outline-none px-5 py-4 text-[15px] text-white placeholder:text-muted2" />
          <button onClick={handleSearch} className="gradient-bg text-white font-semibold px-7 hover:opacity-90 transition-all">Search</button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/directory?category=${encodeURIComponent(cat.name)}`} className="flex-shrink-0 flex items-center gap-2 bg-card border border-white/[.08] rounded-full px-4 py-2.5 hover:border-cyan-400/40 transition-all">
              <span className="text-lg">{cat.icon}</span>
              <span className="text-[13px] font-semibold whitespace-nowrap">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}