"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { CategoryIcon } from "@/lib/services/categoryIcons";

type FavoriteRow = {
  id: string;
  services: {
    id: string;
    title: string;
    description: string;
    city: string;
    image_url: string | null;
    profiles: { full_name: string; business_name: string; phone: string | null } | null;
    categories: { name: string; icon: string } | null;
  } | null;
};

export default function FavoritesPage() {
  const { t } = useLanguage();
  const [favorites, setFavorites] = useState<FavoriteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data } = await supabase
      .from("favorites")
      .select("id, services(id, title, description, city, image_url, profiles(full_name, business_name, phone), categories(name, icon))")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) setFavorites(data as unknown as FavoriteRow[]);
    setLoading(false);
  };

  const removeFavorite = async (favoriteId: string) => {
    setRemovingId(favoriteId);
    await supabase.from("favorites").delete().eq("id", favoriteId);
    setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
    setRemovingId(null);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
        <div className="max-w-[1140px] mx-auto text-muted2 text-sm">{t("favorites_loading")}</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[1140px] mx-auto">
        <div className="text-xs font-bold tracking-[2px] uppercase text-cyan-400 mb-3">{t("favorites_eyebrow")}</div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8">{t("favorites_title")}</h1>

        {favorites.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">💔</div>
            <div className="text-muted2 text-sm">{t("favorites_empty")}</div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((fav) => {
            const s = fav.services;
            if (!s) return null;

            const name = s.profiles?.business_name || s.profiles?.full_name || "Provider";
            const phone = s.profiles?.phone;
            const waLink = phone ? "https://wa.me/1" + phone.replace(/\D/g, "") : null;
            const hasImage = s.image_url !== null && s.image_url !== "";

            return (
              <div key={fav.id} className="bg-card border border-white/[.08] rounded-[20px] overflow-hidden">
                <div className="w-full h-[160px] flex items-center justify-center text-5xl bg-gradient-to-br from-[#0A1628] to-[#0D1A2E] overflow-hidden">
                  {hasImage && <img src={s.image_url as string} alt={s.title} className="w-full h-full object-cover" />}
                  {!hasImage && <CategoryIcon name={s.categories?.name || ""} className="w-10 h-10" />}
                </div>
                <div className="p-4">
                  <div className="text-[15px] font-extrabold mb-1">{name}</div>
                  <div className="text-xs text-muted2 mb-3">{s.title} - {s.city}</div>
                  <div className="flex gap-2">
                    {waLink && <a href={waLink} target="_blank" className="flex-1 text-center py-2 rounded-lg text-xs font-bold bg-green-500 text-white">{t("action_whatsapp")}</a>}
                    <button onClick={() => removeFavorite(fav.id)} disabled={removingId === fav.id} className="px-3 py-2 rounded-lg text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                      {removingId === fav.id ? "..." : t("favorites_remove_btn")}
                    </button>
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
