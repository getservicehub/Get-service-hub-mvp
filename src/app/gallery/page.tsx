"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type Post = {
  id: string;
  image_url: string;
  caption: string | null;
  provider_id: string;
  created_at: string;
  profiles: { full_name: string; business_name: string; phone: string | null } | null;
};

export default function GalleryPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [liked, setLiked] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      if (data.user) {
        supabase.from("post_likes").select("post_id").eq("user_id", data.user.id).then(({ data: likesData }) => {
          if (likesData) setLiked(likesData.map((l) => l.post_id));
        });
      }
    });

    supabase
      .from("posts")
      .select("id, image_url, caption, provider_id, created_at, profiles(full_name, business_name, phone)")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setPosts(data as unknown as Post[]);
        setLoading(false);
      });
  }, [supabase]);

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
      } else {
        console.log("Like failed:", error.message);
      }
    }
  };

  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[1140px] mx-auto">
        <div className="text-xs font-bold tracking-[2px] uppercase text-cyan-400 mb-3">Work Gallery</div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">See Their Best Work</h1>
        <p className="text-base text-muted2 max-w-[540px] mb-10">Browse real projects from local pros. Start a conversation.</p>

        {loading && <div className="text-muted2 text-sm">Loading posts...</div>}

        {!loading && posts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📭</div>
            <div className="text-muted2 text-sm">No posts yet. Providers can share their work from the Dashboard.</div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {posts.map((post) => {
            const isLiked = liked.includes(post.id);
            const isOwnPost = userId !== null && post.provider_id === userId;
            const name = post.profiles?.business_name || post.profiles?.full_name || "Provider";
            const phone = post.profiles?.phone;
            const waLink = phone ? "https://wa.me/1" + phone.replace(/\D/g, "") : null;
            const telLink = phone ? "tel:" + phone.replace(/\D/g, "") : null;

            return (
              <div key={post.id} className="bg-card border border-white/[.08] rounded-[20px] overflow-hidden">
                <div className="flex items-center gap-2.5 px-4 py-3.5">
                  <div className="w-[38px] h-[38px] rounded-full gradient-bg flex items-center justify-center font-extrabold text-white text-[15px]">
                    {name[0]}
                  </div>
                  <div>
                    <div className="text-[13px] font-bold">{name}</div>
                  </div>
                </div>

                <div className="w-full h-[280px] flex items-center justify-center bg-gradient-to-br from-[#0A1628] to-[#0D1A2E] overflow-hidden">
                  <img src={post.image_url} alt="Work post" className="w-full h-full object-cover" />
                </div>

                <div className="flex items-center gap-3 px-4 pt-3">
                  {!isOwnPost && (
                    <button onClick={() => toggleLike(post.id)} className={isLiked ? "text-red-500 text-xl" : "text-muted2 text-xl"}>
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
