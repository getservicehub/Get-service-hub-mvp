"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type Conversation = {
  id: string;
  client_id: string;
  provider_id: string;
  last_message_at: string;
  otherName: string;
  lastMessage: string;
  unread: boolean;
};

export default function MessagesPage() {
  const { t } = useLanguage();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setUserId(user.id);

    const { data: convos } = await supabase
      .from("conversations")
      .select("id, client_id, provider_id, last_message_at")
      .or(`client_id.eq.${user.id},provider_id.eq.${user.id}`)
      .order("last_message_at", { ascending: false });

    if (!convos || convos.length === 0) {
      setLoading(false);
      return;
    }

    const otherIds = convos.map((c) => (c.client_id === user.id ? c.provider_id : c.client_id));
    const { data: profiles } = await supabase.from("profiles").select("id, full_name, business_name").in("id", otherIds);

    const enriched = await Promise.all(
      convos.map(async (c) => {
        const otherId = c.client_id === user.id ? c.provider_id : c.client_id;
        const profile = profiles?.find((p) => p.id === otherId);
        const otherName = profile?.business_name || profile?.full_name || t("messages_default_user");

        const { data: lastMsg } = await supabase
          .from("messages")
          .select("content, sender_id, read_at")
          .eq("conversation_id", c.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        return {
          ...c,
          otherName,
          lastMessage: lastMsg?.content || t("messages_no_messages_yet"),
          unread: lastMsg ? lastMsg.sender_id !== user.id && !lastMsg.read_at : false,
        };
      })
    );

    setConversations(enriched);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[700px] mx-auto">
        <div className="text-xs font-bold tracking-[2px] uppercase text-cyan-400 mb-3">{t("nav_messages")}</div>
        <h1 className="text-3xl font-extrabold mb-8">{t("messages_title")}</h1>

        {loading && <div className="text-muted2 text-sm">{t("messages_loading")}</div>}

        {!loading && conversations.length === 0 && (
          <div className="text-center py-16 bg-card border border-white/[.08] rounded-2xl">
            <div className="text-5xl mb-4">💬</div>
            <div className="text-muted2 text-sm">{t("messages_empty")}</div>
          </div>
        )}

        <div className="space-y-2">
          {conversations.map((c) => (
            <Link key={c.id} href={`/messages/${c.id}`} className="flex items-center gap-3 bg-card border border-white/[.08] rounded-2xl p-4 hover:border-white/20 transition-all">
              <div className="w-11 h-11 rounded-full gradient-bg flex items-center justify-center font-extrabold text-white text-sm flex-shrink-0">
                {c.otherName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold truncate">{c.otherName}</div>
                  {c.unread && <span className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0" />}
                </div>
                <div className="text-xs text-muted2 truncate">{c.lastMessage}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
