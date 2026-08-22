"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function PostLikeButton({ postId }: { postId: string }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      if (data.user) {
        supabase
          .from("post_likes")
          .select("id")
          .eq("user_id", data.user.id)
          .eq("post_id", postId)
          .maybeSingle()
          .then(({ data: l }) => setIsLiked(!!l));
      }
    });
  }, []);

  const toggleLike = async () => {
    if (!userId) {
      window.location.href = "/login";
      return;
    }
    if (isLiked) {
      await supabase.from("post_likes").delete().eq("user_id", userId).eq("post_id", postId);
      setIsLiked(false);
    } else {
      const { error } = await supabase.from("post_likes").insert({ user_id: userId, post_id: postId });
      if (!error || error.code === "23505") setIsLiked(true);
    }
  };

  return (
    <button onClick={toggleLike} className={isLiked ? "text-red-500 text-lg mb-2" : "text-muted2 text-lg mb-2"}>
      {isLiked ? "Liked" : "Like"}
    </button>
  );
}
