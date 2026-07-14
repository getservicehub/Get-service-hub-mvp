"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getProviderName, getContactLinks, type ServiceCard } from "@/lib/services/queries";
import { CategoryIcon } from "@/lib/services/categoryIcons";

type Props = {
  allServices: ServiceCard[];
  sponsored: ServiceCard[];
};

export default function DiscoverClient({ allServices, sponsored }: Props) {
  const [liked, setLiked] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      if (data.user) {
        supabase.from("favorites").select("service_id").eq("user_id", data.user.id).then(({ data: favs }) => {
          if (favs) setLiked(favs.map((f) => f.service_id));
        });
        supabase.from("follows").select("provider_id").eq("client_id", data.user.id).then(({ data: follows }) => {
          if (follows) setFollowing(follows.map((f) => f.provider_id));
        });
      }
    });
  }, []);

  const toggleLike = async (serviceId: string) => {
    if (!userId) {
      window.location.href = "/login";
      return;
    }

    if (liked.includes(serviceId)) {
      const { error } = await supabase.from("favorites").delete().eq("user_id", userId).eq("service_id", serviceId);
      if (!error) {
        setLiked((prev) => prev.filter((id) => id !== serviceId));
      }
    } else {
      const { error } = await supabase.from("favorites").insert({ user_id: userId, service_id: serviceId });
      if (!error || error.code === "23505") {
        setLiked((prev) => [...prev, serviceId]);
      }
    }
  };

  const toggleFollow = async (providerId: string) => {
    if (!userId) {
      window.location.href = "/login";
      return;
    }

    if (following.includes(providerId)) {
      const { error } = await supabase.from("follows").delete().eq("client_id", userId).eq("provider_id", providerId);
      if (!error) {
        setFollowing((prev) => prev.filter((id) => id !== providerId));
      }
    } else {
      const { error } = await supabase.from("follows").insert({ client_id: userId, provider_id: providerId });
      if (!error || error.code === "23505") {
        setFollowing((prev) => [...prev, providerId]);
      }
    }
  };

  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[1140px] mx-auto">

        {sponsored.length > 0 && (
          <div className="mb-12">
            <div className="text-[10px] font-bold tracking-[2px] uppercase text-amber-400 mb-4">Sponsored</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sponsored.map((s) => {
                const hasImage = s.image_url !== null && s.image_url !== "";
                return (
                  <a key={s.id} href={`/service/${s.id}`} className="block bg-card border border-amber-400/20 rounded-2xl overflow-hidden hover:border-amber-400/40 transition-all">
                    <div className="w-full h-[100px] flex items-center justify-center text-cyan-400 bg-gradient-to-br from-[#0A1628] to-[#0D1A2E] overflow-hidden">
                      {hasImage && <img src={s.image_url as string} alt={s.title} className="w-full h-full object-cover" />}
                      {!hasImage && <CategoryIcon name={s.categories?.name || ""} className="w-8 h-8" />}
                    </div>
                    <div className="p-3">
                      <div className="text-[12px] font-bold truncate">{getProviderName(s)}</div>
                      <div className="text-[10px] text-muted2 truncate">{s.title}</div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        <div className="text-xs font-bold tracking-[2px] uppercase text-cyan-400 mb-3">Discover Pros</div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Local Talent, Right Here</h1>
        <p className="text-base text-muted2 max-w-[540px] mb-10">Follow your favorite pros, like their work, and start a conversation instantly.</p>

        {allServices.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📭</div>
            <div className="text-muted2 text-sm">No pros to discover yet.</div>
          </div>
        )}

        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {allServices.map((s) => {
            const isLiked = liked.includes(s.id);
            const isFollowing = following.includes(s.provider_id);
            const isOwnService = userId !== null && s.provider_id === userId;
            const name = getProviderName(s);
            const { waLink, smsLink } = getContactLinks(s);
            const hasImage = s.image_url !== null && s.image_url !== "";

            return (
              <div key={s.id} className="flex-shrink-0 w-[240px] snap-start bg-card border border-white/[.08] rounded-[20px] overflow-hidden hover:border-white/20 hover:scale-[1.02] transition-all">
                <a href={`/service/${s.id}`} className="block">
                  <div className="w-full h-[140px] flex items-center justify-center text-cyan-400 bg-gradient-to-br from-[#0A1628] to-[#0D1A2E] overflow-hidden">
                    {hasImage && <img src={s.image_url as string} alt={s.title} className="w-full h-full object-cover" />}
                    {!hasImage && <CategoryIcon name={s.categories?.name || ""} className="w-10 h-10" />}
                  </div>
                  <div className="px-4 pt-4">
                    <div className="text-[13px] font-bold mb-0.5">{name}</div>
                    <div className="text-[11px] text-muted2 mb-3">{s.title} - {s.city}</div>
                  </div>
                </a>
                <div className="px-4 pb-4">
                  <div className="flex gap-1.5">
                    {!isOwnService && (
                      <button onClick={() => toggleFollow(s.provider_id)} className={isFollowing ? "flex-1 py-1.5 rounded-lg text-[11px] font-bold border border-white/20 text-cyan-400" : "flex-1 py-1.5 rounded-lg text-[11px] font-bold gradient-bg text-white"}>
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                    )}
                    {!isOwnService && (
                      <button onClick={() => toggleLike(s.id)} className={isLiked ? "flex-1 py-1.5 rounded-lg text-[11px] font-bold bg-red-500 text-white" : "flex-1 py-1.5 rounded-lg text-[11px] font-bold bg-red-500/10 text-red-400 border border-red-500/20"}>
                        {isLiked ? "Liked" : "Like"}
                      </button>
                    )}
                    {isOwnService && (
                      <span className="flex-1 py-1.5 rounded-lg text-[11px] font-bold bg-white/5 text-muted2 text-center">Your service</span>
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
