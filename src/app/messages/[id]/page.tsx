"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Message = {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

export default function ChatThreadPage() {
  const params = useParams();
  const conversationId = params.id as string;
  const supabase = createClient();

  const [messages, setMessages] = useState<Message[]>([]);
  const [otherName, setOtherName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadThread();

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadThread = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setUserId(user.id);

    const { data: convo } = await supabase.from("conversations").select("client_id, provider_id").eq("id", conversationId).single();

    if (convo) {
      const otherId = convo.client_id === user.id ? convo.provider_id : convo.client_id;
      const { data: profile } = await supabase.from("profiles").select("full_name, business_name").eq("id", otherId).single();
      if (profile) setOtherName(profile.business_name || profile.full_name || "User");
    }

    const { data: msgs } = await supabase.from("messages").select("id, sender_id, content, created_at").eq("conversation_id", conversationId).order("created_at", { ascending: true });

    if (msgs) setMessages(msgs);
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !userId) return;
    setSending(true);

    const content = newMessage.trim();
    setNewMessage("");

    await supabase.from("messages").insert({ conversation_id: conversationId, sender_id: userId, content });
    await supabase.from("conversations").update({ last_message_at: new Date().toISOString() }).eq("id", conversationId);

    setSending(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
        <div className="max-w-[700px] mx-auto text-muted2 text-sm">Loading conversation...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-24 px-5">
      <div className="max-w-[700px] mx-auto">
        <div className="text-xs font-bold tracking-[2px] uppercase text-cyan-400 mb-1">Conversation with</div>
        <h1 className="text-2xl font-extrabold mb-6">{otherName}</h1>

        <div className="bg-card border border-white/[.08] rounded-2xl p-4 mb-4 min-h-[400px] max-h-[500px] overflow-y-auto flex flex-col gap-3">
          {messages.length === 0 && (
            <div className="text-center text-muted2 text-sm py-10">Say hello to start the conversation.</div>
          )}

          {messages.map((m) => {
            const isMine = m.sender_id === userId;
            return (
              <div key={m.id} className={isMine ? "flex justify-end" : "flex justify-start"}>
                <div className={isMine ? "max-w-[75%] bg-blue-600 text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-sm" : "max-w-[75%] bg-white/10 text-white rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm"}>
                  {m.content}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400"
          />
          <button onClick={sendMessage} disabled={sending || !newMessage.trim()} className="px-6 py-3 rounded-lg gradient-bg text-white font-bold text-sm disabled:opacity-50">
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
