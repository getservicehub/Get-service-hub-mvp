"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type ServiceRow = {
  id: string;
  title: string;
  city: string;
  provider_id: string;
  image_url: string | null;
  profiles: { full_name: string; business_name: string; phone: string | null } | null;
  categories: { name: string; icon: string } | null;
};

export default function DiscoverPage() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [liked, setLiked] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      if (data.user) {
        supabase.from("favorites").select("service_id").eq("user_id", data.user.id).then(({ data: favs }) => {
          if (favs) setLiked(favs.map((f) => f.service_id));
        });
      }
    });

    supabase
      .from("services")
      .select("id, title, city, provider_id, image_url, profiles(full_name, business_name, phone), categories(name, icon)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setServices(data as unknown as ServiceRow[]);
        setLoading(false);
      });
  }, [supabase]);

  const toggleLike = async (serviceId: string) => {
    if (!userId) {
      window.location.href = "/login";
      return;
    }

    if (liked.includes(serviceId)) {
      await supabase.from("favorites").delete().eq("user_id", userId).eq("service_id", serviceId);
      setLiked((prev) => prev.filter((id) => id !== serviceId));
    } else {
      await supabase.from("favorites").insert({ user_id: userId, service_id: serviceId });
      setLiked((prev) => [...prev, serviceId]);
    }
  };return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[1140px] mx-auto">
        <div className="text-xs font-bold tracking-[2px] uppercase text-cyan-400 mb-3">Discover Pros</div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Local Talent, Right Here</h1>
        <p className="text-base text-muted2 max-w-[540px] mb-10">Follow your favorite pros, like their work, and start a conversation instantly.</p>

        {loading && <div className="text-muted2 text-sm">Loading pros...</div>}

        {!loading && services.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📭</div>
            <div className="text-muted2 text-sm">No pros to discover yet.</div>
          </div>
        )}

        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {services.map((s) => {
            const isLiked = liked.includes(s.id);
            const isOwnService = userId !== null && s.provider_id === userId;
            const name = s.profiles?.business_name || s.profiles?.full_name || "Provider";
            const phone = s.profiles?.phone;
            const waLink = phone ? "https://wa.me/1" + phone.replace(/\D/g, "") : null;
            const hasImage = s.image_url !== null && s.image_url !== "";

            return (
              <div key={s.id} className="flex-shrink-0 w-[240px] snap-start bg-card border border-white/[.08] rounded-[20px] overflow-hidden hover:border-white/20 hover:scale-[1.02] transition-all">
                <a href={`/service/${s.id}`} className="block">
                  <div className="w-full h-[140px] flex items-center justify-center text-5xl bg-gradient-to-br from-[#0A1628] to-[#0D1A2E] overflow-hidden">
                    {hasImage && <img src={s.image_url as string} alt={s.title} className="w-full h-full object-cover" />}
                    {!hasImage && <span>{s.categories?.icon || "⚡"}</span>}
                  </div>
                  <div className="px-4 pt-4">
                    <div className="text-[13px] font-bold mb-0.5">{name}</div>
                    <div className="text-[11px] text-muted2 mb-3">{s.title} - {s.city}</div>
                  </div>
                </a>
                <div className="px-4 pb-4">
                  <div className="flex gap-1.5">
                    {!isOwnService && (
                      <button onClick={() => toggleLike(s.id)} className={isLiked ? "flex-1 py-1.5 rounded-lg text-[11px] font-bold bg-red-500 text-white" : "flex-1 py-1.5 rounded-lg text-[11px] font-bold bg-red-500/10 text-red-400 border border-red-500/20"}>
                        {isLiked ? "Liked" : "Like"}
                      </button>
                    )}
                    {isOwnService && (
                      <span className="flex-1 py-1.5 rounded-lg text-[11px] font-bold bg-white/5 text-muted2 text-center">Your service</span>
                    )}
                    {waLink && !isOwnService && (
                      <a href={waLink} target="_blank" onClick={(e) => e.stopPropagation()} className="flex-1 py-1.5 rounded-lg text-[11px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 text-center">Chat</a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}