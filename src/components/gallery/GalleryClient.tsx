"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type Post = {
  id: string;
  image_url: string;
  caption: string | null;
  provider_id: string;
  created_at: string;
  profiles: { full_name: string; business_name: string; phone: string | null; avatar_url: string | null } | null;
  extraImages: string[];
};

type Props = {
  posts: Post[];
};

export default function GalleryClient({ posts }: Props) {
  const [liked, setLiked] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [tab, setTab] = useState<"all" | "following">("all");
  const [imageIndex, setImageIndex] = useState<Record<string, number>>({});
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      if (data.user) {
        supabase.from("post_likes").select("post_id").eq("user_id", data.user.id).then(({ data: likesData }) => {
          if (likesData) setLiked(likesData.map((l) => l.post_id));
        });
        supabase.from("follows").select("provider_id").eq("client_id", data.user.id).then(({ data: followData }) => {
          if (followData) setFollowing(followData.map((f) => f.provider_id));
        });
      }
    });
  }, []);

  const toggleLike = async (postId: string) => {
    if (!userId) {
      window.location.href = "/login";
      return;
    }

    if (liked.includes(postId)) {
      const { error } = await supabase.from("post_likes").delete().eq("user_id", userId).eq("post_id", postId);
      if (!error) {
        setLiked((prev) => prev.filter((id) => id !== postId));
      }
    } else {
      const { error } = await supabase.from("post_likes").insert({ user_id: userId, post_id: postId });
      if (!error || error.code === "23505") {
        setLiked((prev) => [...prev, postId]);
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

  const filteredPosts = tab === "following" ? posts.filter((p) => following.includes(p.provider_id)) : posts;

  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[1140px] mx-auto">
        <div className="text-xs font-bold tracking-[2px] uppercase text-cyan-400 mb-3">Work Gallery</div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">See Their Best Work</h1>
        <p className="text-base text-muted2 max-w-[540px] mb-8">Browse real projects from local pros. Start a conversation.</p>

        <div className="flex gap-2 mb-8">
          <button onClick={() => setTab("all")} className={tab === "all" ? "px-4.5 py-2 rounded-full text-[13px] font-semibold gradient-bg text-white" : "px-4.5 py-2 rounded-full text-[13px] font-semibold border border-white/20 text-muted2"}>All</button>
          <button onClick={() => setTab("following")} className={tab === "following" ? "px-4.5 py-2 rounded-full text-[13px] font-semibold gradient-bg text-white" : "px-4.5 py-2 rounded-full text-[13px] font-semibold border border-white/20 text-muted2"}>Following</button>
        </div>

        {tab === "following" && !userId && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔒</div>
            <div className="text-muted2 text-sm mb-3">Sign in to see posts from pros you follow.</div>
            <a href="/login" className="inline-block px-5 py-2 rounded-lg gradient-bg text-white font-semibold text-sm">Sign In</a>
          </div>
        )}

        {tab === "following" && userId && filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">👥</div>
            <div className="text-muted2 text-sm">You are not following anyone yet. Follow pros from the Find page.</div>
          </div>
        )}

        {tab === "all" && filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📭</div>
            <div className="text-muted2 text-sm">No posts yet. Providers can share their work from the Dashboard.</div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPosts.map((post) => {
            const isLiked = liked.includes(post.id);
            const isFollowing = following.includes(post.provider_id);
            const isOwnPost = userId !== null && post.provider_id === userId;
            const name = post.profiles?.business_name || post.profiles?.full_name || "Provider";
            const phone = post.profiles?.phone;
            const waLink = phone ? "https://wa.me/1" + phone.replace(/\D/g, "") : null;
            const telLink = phone ? "tel:" + phone.replace(/\D/g, "") : null;
            const smsLink = phone ? "sms:" + phone.replace(/\D/g, "") : null;

            return (
              <div key={post.id} className="bg-card border border-white/[.08] rounded-[20px] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-[38px] h-[38px] rounded-full gradient-bg flex items-center justify-center font-extrabold text-white text-[15px] overflow-hidden">
                      {post.profiles?.avatar_url ? <img src={post.profiles.avatar_url} alt={name} className="w-full h-full object-cover" /> : name[0]}
                    </div>
                    <div className="text-[13px] font-bold">{name}</div>
                  </div>
                  {!isOwnPost && (
                    <button onClick={() => toggleFollow(post.provider_id)} className={isFollowing ? "text-[11px] font-bold px-3 py-1.5 rounded-full border border-white/20 text-cyan-400" : "text-[11px] font-bold px-3 py-1.5 rounded-full gradient-bg text-white"}>
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                  )}
                </div>

                <div className="relative w-full h-[280px] flex items-center justify-center bg-gradient-to-br from-[#0A1628] to-[#0D1A2E] overflow-hidden">
                  <img src={[post.image_url, ...post.extraImages][imageIndex[post.id] || 0]} alt="Work post" className="w-full h-full object-cover" />
                  {post.extraImages.length > 0 && (
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                      {[post.image_url, ...post.extraImages].map((_, i) => (
                        <button key={i} onClick={() => setImageIndex((prev) => ({ ...prev, [post.id]: i }))} className={(imageIndex[post.id] || 0) === i ? "w-5 h-1.5 rounded-full bg-white transition-all" : "w-1.5 h-1.5 rounded-full bg-white/40 transition-all"} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 px-4 pt-3">
                  {!isOwnPost && (
                    <button onClick={() => toggleLike(post.id)} className={isLiked ? "px-4 py-1.5 rounded-full text-xs font-bold bg-red-500 text-white" : "px-4 py-1.5 rounded-full text-xs font-bold border border-white/20 text-muted2"}>
                      {isLiked ? "Liked" : "Like"}
                    </button>
                  )}
                  {isOwnPost && <span className="text-xs text-muted2 font-semibold">Your post</span>}
                </div>

                {post.caption && (
                  <div className="text-[13px] text-muted2 px-4 pt-2 pb-3">
                    <span className="text-white font-bold">{name}</span> {post.caption}
                  </div>
                )}

                {!isOwnPost && telLink && (
                  <div className="flex gap-2 px-4 pb-4">
                    <a href={telLink} className="flex-1 text-center py-2 rounded-lg text-xs font-bold bg-red-500 text-white">Call</a>
                    <a href={smsLink || "#"} className="flex-1 text-center py-2 rounded-lg text-xs font-bold bg-blue-500 text-white">Text</a>
                    <a href={waLink || "#"} target="_blank" className="flex-1 text-center py-2 rounded-lg text-xs font-bold bg-green-500 text-white">WhatsApp</a>
                  </div>
                )}

                {!isOwnPost && !telLink && (
                  <div className="flex gap-2 px-4 pb-4">
                    <span className="flex-1 text-center py-2 rounded-lg text-xs font-bold bg-white/5 text-muted2">No phone</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
