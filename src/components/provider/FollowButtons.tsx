"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function FollowButtons({ providerId, phone }: { providerId: string; phone: string | null }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      if (data.user) {
        supabase
          .from("follows")
          .select("id")
          .eq("client_id", data.user.id)
          .eq("provider_id", providerId)
          .maybeSingle()
          .then(({ data: f }) => setIsFollowing(!!f));
      }
    });
  }, []);

  const toggleFollow = async () => {
    if (!userId) {
      window.location.href = "/login";
      return;
    }
    if (isFollowing) {
      await supabase.from("follows").delete().eq("client_id", userId).eq("provider_id", providerId);
      setIsFollowing(false);
    } else {
      const { error } = await supabase.from("follows").insert({ client_id: userId, provider_id: providerId });
      if (!error || error.code === "23505") setIsFollowing(true);
    }
  };

  if (userId === providerId) return null;

  const waLink = phone ? "https://wa.me/1" + phone.replace(/\D/g, "") : null;
  const telLink = phone ? "tel:" + phone.replace(/\D/g, "") : null;
  const smsLink = phone ? "sms:" + phone.replace(/\D/g, "") : null;

  return (
    <div className="flex gap-2 flex-wrap">
      <button onClick={toggleFollow} className={isFollowing ? "px-4 py-2 rounded-lg text-xs font-bold border border-white/20 text-cyan-400" : "px-4 py-2 rounded-lg text-xs font-bold gradient-bg text-white"}>
        {isFollowing ? "Following" : "Follow"}
      </button>
      {telLink && <a href={telLink} className="px-4 py-2 rounded-lg text-xs font-bold bg-red-500 text-white">Call</a>}
      {smsLink && <a href={smsLink} className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-500 text-white">Text</a>}
      {waLink && <a href={waLink} target="_blank" className="px-4 py-2 rounded-lg text-xs font-bold bg-green-500 text-white">WhatsApp</a>}
    </div>
  );
}
