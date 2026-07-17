"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { CategoryIcon } from "@/lib/services/categoryIcons";
import StarRating from "@/components/ui/StarRating";

type Profile = {
  id: string;
  full_name: string;
  business_name: string | null;
  avatar_url: string | null;
  city: string | null;
  phone: string | null;
  is_verified: boolean;
  created_at: string;
};

type Service = {
  id: string;
  title: string;
  description: string;
  city: string;
  price_from: number | null;
  emergency: boolean;
  espanol: boolean;
  image_url: string | null;
  plan: string;
  categories: { name: string; icon: string } | null;
};

type Post = {
  id: string;
  image_url: string;
  caption: string | null;
};

type Props = {
  profile: Profile;
  services: Service[];
  posts: Post[];
  avgRating: number | null;
  reviewCount: number;
};

export default function ProviderProfileClient({ profile, services, posts, avgRating, reviewCount }: Props) {
  const [tab, setTab] = useState<"services" | "gallery" | "reviews">("services");
  const [userId, setUserId] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      if (data.user) {
        supabase.from("follows").select("id").eq("client_id", data.user.id).eq("provider_id", profile.id).maybeSingle().then(({ data: f }) => {
          setIsFollowing(!!f);
        });
        supabase.from("post_likes").select("post_id").eq("user_id", data.user.id).then(({ data: likes }) => {
          if (likes) setLikedPosts(likes.map((l) => l.post_id));
        });
      }
    });

    const serviceIds = services.map((s) => s.id);
    if (serviceIds.length > 0) {
      supabase.from("reviews").select("id, rating, comment, created_at, client_id, service_id, profiles(full_name)").in("service_id", serviceIds).order("created_at", { ascending: false }).then(({ data }) => {
        if (data) setReviews(data);
      });
    }
  }, []);

  const toggleFollow = async () => {
    if (!userId) {
      window.location.href = "/login";
      return;
    }

    if (isFollowing) {
      await supabase.from("follows").delete().eq("client_id", userId).eq("provider_id", profile.id);
      setIsFollowing(false);
    } else {
      const { error } = await supabase.from("follows").insert({ client_id: userId, provider_id: profile.id });
      if (!error || error.code === "23505") {
        setIsFollowing(true);
      }
    }
  };

  const togglePostLike = async (postId: string) => {
    if (!userId) {
      window.location.href = "/login";
      return;
    }

    if (likedPosts.includes(postId)) {
      await supabase.from("post_likes").delete().eq("user_id", userId).eq("post_id", postId);
      setLikedPosts((prev) => prev.filter((id) => id !== postId));
    } else {
      const { error } = await supabase.from("post_likes").insert({ user_id: userId, post_id: postId });
      if (!error || error.code === "23505") {
        setLikedPosts((prev) => [...prev, postId]);
      }
    }
  };

  const isOwnProfile = userId === profile.id;
  const name = profile.business_name || profile.full_name;
  const waLink = profile.phone ? "https://wa.me/1" + profile.phone.replace(/\D/g, "") : null;
  const telLink = profile.phone ? "tel:" + profile.phone.replace(/\D/g, "") : null;
  const smsLink = profile.phone ? "sms:" + profile.phone.replace(/\D/g, "") : null;
  const memberSince = new Date(profile.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long" });

  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[900px] mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5 mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-card border-2 border-white/10 flex items-center justify-center text-3xl flex-shrink-0">
            {profile.avatar_url ? <img src={profile.avatar_url} alt={name} className="w-full h-full object-cover" /> : <span>{name[0]}</span>}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-2xl font-extrabold">{name}</h1>
              {profile.is_verified && <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-bold">✓ Verified</span>}
            </div>
            <div className="text-sm text-muted2 mb-2">{profile.city} - Member since {memberSince}</div>

            {avgRating && (
              <div className="flex items-center gap-1.5 mb-3">
                <StarRating rating={avgRating} size="text-sm" />
                <span className="text-xs text-muted2">{avgRating} ({reviewCount} reviews)</span>
              </div>
            )}

            {!isOwnProfile && (
              <div className="flex gap-2 flex-wrap">
                <button onClick={toggleFollow} className={isFollowing ? "px-4 py-2 rounded-lg text-xs font-bold border border-white/20 text-cyan-400" : "px-4 py-2 rounded-lg text-xs font-bold gradient-bg text-white"}>
                  {isFollowing ? "Following" : "Follow"}
                </button>
                {telLink && <a href={telLink} className="px-4 py-2 rounded-lg text-xs font-bold bg-red-500 text-white">Call</a>}
                {smsLink && <a href={smsLink} className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-500 text-white">Text</a>}
                {waLink && <a href={waLink} target="_blank" className="px-4 py-2 rounded-lg text-xs font-bold bg-green-500 text-white">WhatsApp</a>}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 mb-6 border-b border-white/[.08]">
          <button onClick={() => setTab("services")} className={tab === "services" ? "px-4 py-3 text-sm font-bold text-cyan-400 border-b-2 border-cyan-400" : "px-4 py-3 text-sm font-bold text-muted2"}>Services</button>
          <button onClick={() => setTab("gallery")} className={tab === "gallery" ? "px-4 py-3 text-sm font-bold text-cyan-400 border-b-2 border-cyan-400" : "px-4 py-3 text-sm font-bold text-muted2"}>Gallery</button>
          <button onClick={() => setTab("reviews")} className={tab === "reviews" ? "px-4 py-3 text-sm font-bold text-cyan-400 border-b-2 border-cyan-400" : "px-4 py-3 text-sm font-bold text-muted2"}>Reviews</button>
        </div>

        {tab === "services" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.length === 0 && <div className="text-muted2 text-sm py-10 text-center">No active services.</div>}
            {services.map((s) => {
              const hasImage = s.image_url !== null && s.image_url !== "";
              return (
                <a key={s.id} href={`/service/${s.id}`} className="block bg-card border border-white/[.08] rounded-2xl overflow-hidden hover:border-white/20 transition-all">
                  <div className="w-full h-[140px] flex items-center justify-center text-cyan-400 bg-gradient-to-br from-[#0A1628] to-[#0D1A2E] overflow-hidden">
                    {hasImage && <img src={s.image_url as string} alt={s.title} className="w-full h-full object-cover" />}
                    {!hasImage && <CategoryIcon name={s.categories?.name || ""} className="w-10 h-10" />}
                  </div>
                  <div className="p-4">
                    <div className="text-sm font-bold mb-1">{s.title}</div>
                    <div className="text-xs text-muted2">{s.categories?.name} - {s.city}</div>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {tab === "gallery" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.length === 0 && <div className="text-muted2 text-sm py-10 text-center">No posts yet.</div>}
            {posts.map((post) => {
              const isLiked = likedPosts.includes(post.id);
              return (
                <div key={post.id} className="bg-card border border-white/[.08] rounded-2xl overflow-hidden">
                  <div className="w-full h-[240px] flex items-center justify-center bg-gradient-to-br from-[#0A1628] to-[#0D1A2E] overflow-hidden">
                    <img src={post.image_url} alt="Work" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    {!isOwnProfile && (
                      <button onClick={() => togglePostLike(post.id)} className={isLiked ? "text-red-500 text-lg mb-2" : "text-muted2 text-lg mb-2"}>
                        {isLiked ? "Liked" : "Like"}
                      </button>
                    )}
                    {post.caption && <div className="text-xs text-muted2">{post.caption}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "reviews" && (
          <div className="space-y-3">
            {reviews.length === 0 && <div className="text-muted2 text-sm py-10 text-center">No reviews yet.</div>}
            {reviews.map((r) => (
              <div key={r.id} className="bg-card border border-white/[.08] rounded-2xl p-4">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center font-extrabold text-white text-sm">
                    {r.profiles?.full_name?.[0] || "U"}
                  </div>
                  <div>
                    <div className="text-[13px] font-bold">{r.profiles?.full_name || "User"}</div>
                    <div className="text-[11px] text-amber-400">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                  </div>
                </div>
                {r.comment && <p className="text-sm text-muted2">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
