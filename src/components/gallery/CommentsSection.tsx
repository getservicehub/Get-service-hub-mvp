"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type Comment = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: { full_name: string } | null;
};

type Props = {
  postId: string;
};

export default function CommentsSection({ postId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [reportedIds, setReportedIds] = useState<string[]>([]);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    const { data } = await supabase.from("post_comments").select("id, content, created_at, user_id, profiles(full_name)").eq("post_id", postId).order("created_at", { ascending: true });
    if (data) setComments(data as unknown as Comment[]);
    setLoading(false);
  };

  const postComment = async () => {
    if (!newComment.trim()) return;
    if (!userId) {
      window.location.href = "/login";
      return;
    }

    setPosting(true);
    const { error } = await supabase.from("post_comments").insert({ post_id: postId, user_id: userId, content: newComment.trim() });
    if (!error) {
      setNewComment("");
      await loadComments();
    }
    setPosting(false);
  };

  const reportComment = async (commentId: string) => {
    if (!userId) {
      window.location.href = "/login";
      return;
    }
    await supabase.from("comment_reports").insert({ comment_id: commentId, reporter_id: userId, reason: "Reported by user" });
    setReportedIds((prev) => [...prev, commentId]);
  };

  return (
    <div className="border-t border-white/[.08] pt-3 mt-1">
      {loading && <div className="text-xs text-muted2 px-4 pb-2">Loading comments...</div>}

      {!loading && comments.length === 0 && (
        <div className="text-xs text-muted2 px-4 pb-3">No comments yet. Be the first.</div>
      )}

      <div className="space-y-2 px-4 pb-3">
        {comments.map((c) => (
          <div key={c.id} className="flex items-start justify-between gap-2">
            <div className="text-xs">
              <span className="font-bold">{c.profiles?.full_name || "User"}</span>{" "}
              <span className="text-muted2">{c.content}</span>
            </div>
            {!reportedIds.includes(c.id) && c.user_id !== userId && (
              <button onClick={() => reportComment(c.id)} className="text-[10px] text-muted2 hover:text-red-400 flex-shrink-0">Report</button>
            )}
            {reportedIds.includes(c.id) && (
              <span className="text-[10px] text-muted2 flex-shrink-0">Reported</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2 px-4 pb-4">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && postComment()}
          placeholder="Add a comment..."
          className="flex-1 px-3 py-2 bg-bg2 border border-white/20 rounded-lg text-white text-xs outline-none focus:border-cyan-400"
        />
        <button onClick={postComment} disabled={posting || !newComment.trim()} className="px-4 py-2 rounded-lg text-xs font-bold gradient-bg text-white disabled:opacity-50">
          Post
        </button>
      </div>
    </div>
  );
}
