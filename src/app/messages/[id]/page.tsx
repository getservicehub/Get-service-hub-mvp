"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { CategoryIcon } from "@/lib/services/categoryIcons";
import StarRating from "@/components/ui/StarRating";
import { Send, ExternalLink, ShieldCheck, MapPin, Zap } from "lucide-react";

type Message = {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
};

type ProviderInfo = {
  id: string;
  name: string;
  avatarUrl: string | null;
  isVerified: boolean;
  avgRating: number | null;
  reviewCount: number;
  respondsQuickly: boolean;
};

type ServiceInfo = {
  title: string;
  categoryName: string;
  city: string;
  priceFrom: number | null;
  espanol: boolean;
  plan: string;
};

export default function ChatThreadPage() {
  const params = useParams();
  const conversationId = params.id as string;
  const supabase = createClient();

  const [messages, setMessages] = useState<Message[]>([]);
  const [provider, setProvider] = useState<ProviderInfo | null>(null);
  const [serviceInfo, setServiceInfo] = useState<ServiceInfo | null>(null);
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

    const { data: convo } = await supabase.from("conversations").select("client_id, provider_id, service_id").eq("id", conversationId).single();

    if (convo) {
      const otherId = convo.client_id === user.id ? convo.provider_id : convo.client_id;
      const isOtherProvider = otherId === convo.provider_id;

      const { data: profile } = await supabase.from("profiles").select("full_name, business_name, avatar_url, is_verified").eq("id", otherId).single();

      if (profile) {
        let avgRating: number | null = null;
        let reviewCount = 0;
        let respondsQuickly = false;

        if (isOtherProvider) {
          const { data: myServices } = await supabase.from("services").select("id").eq("provider_id", otherId);
          const serviceIds = (myServices || []).map((s) => s.id);
          if (serviceIds.length > 0) {
            const { data: ratings } = await supabase.from("service_ratings").select("avg_rating, review_count").in("service_id", serviceIds);
            if (ratings && ratings.length > 0) {
              const totalReviews = ratings.reduce((sum, r) => sum + r.review_count, 0);
              const weightedSum = ratings.reduce((sum, r) => sum + r.avg_rating * r.review_count, 0);
              if (totalReviews > 0) {
                avgRating = Math.round((weightedSum / totalReviews) * 10) / 10;
                reviewCount = totalReviews;
              }
            }
          }
          const { data: rs } = await supabase.from("provider_response_stats").select("replied_conversations, avg_response_minutes").eq("provider_id", otherId).maybeSingle();
          if (rs) respondsQuickly = rs.replied_conversations >= 3 && rs.avg_response_minutes < 60;
        }

        setProvider({
          id: otherId,
          name: profile.business_name || profile.full_name || "User",
          avatarUrl: profile.avatar_url,
          isVerified: profile.is_verified || false,
          avgRating,
          reviewCount,
          respondsQuickly,
        });
      }

      if (convo.service_id) {
        const { data: svc } = await supabase.from("services").select("title, city, price_from, espanol, plan, categories(name)").eq("id", convo.service_id).single();
        if (svc) {
          setServiceInfo({
            title: svc.title,
            categoryName: (svc as any).categories?.name || "",
            city: svc.city,
            priceFrom: svc.price_from,
            espanol: svc.espanol,
            plan: svc.plan,
          });
        }
      }
    }

    const { data: msgs } = await supabase.from("messages").select("id, sender_id, content, created_at, read_at").eq("conversation_id", conversationId).order("created_at", { ascending: true });
    if (msgs) setMessages(msgs);
    setLoading(false);

    await supabase.from("messages").update({ read_at: new Date().toISOString() }).eq("conversation_id", conversationId).neq("sender_id", user.id).is("read_at", null);
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
      <main className="min-h-screen bg-bg text-white pt-[100px] px-5">
        <div className="max-w-[1140px] mx-auto text-muted2 text-sm">Loading conversation...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg text-white pt-[88px] flex flex-col">
      <div className="border-b border-white/[.08] px-5 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full overflow-hidden bg-bg2 border border-white/10 flex items-center justify-center text-sm font-extrabold flex-shrink-0">
            {provider?.avatarUrl ? <img src={provider.avatarUrl} alt={provider.name} className="w-full h-full object-cover" /> : <span>{provider?.name?.[0] || "?"}</span>}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold">{provider?.name}</span>
              {provider?.isVerified && <ShieldCheck className="w-4 h-4 text-cyan-400" />}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted2">
              {serviceInfo && <span>{serviceInfo.categoryName} - {serviceInfo.city}</span>}
              {provider?.avgRating && (
                <span className="flex items-center gap-1"><StarRating rating={provider.avgRating} size="text-[10px]" /> {provider.avgRating} ({provider.reviewCount})</span>
              )}
              {provider?.respondsQuickly && <span className="text-green-400 font-semibold flex items-center gap-0.5"><Zap className="w-3 h-3" /> Responde rápido</span>}
            </div>
          </div>
        </div>
        {provider && (
          <Link href={`/provider/${provider.id}`} className="px-4 py-2 rounded-lg border border-white/20 text-xs font-bold flex items-center gap-1.5 flex-shrink-0 hover:border-cyan-400/40 transition-colors">
            Ver Perfil <ExternalLink className="w-3 h-3" />
          </Link>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden max-w-[1140px] mx-auto w-full">
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3">
            {messages.length === 0 && (
              <div className="text-center text-muted2 text-sm py-10">Say hello to start the conversation.</div>
            )}
            {messages.map((m) => {
              const isMine = m.sender_id === userId;
              return (
                <div key={m.id} className={isMine ? "flex justify-end" : "flex justify-start"}>
                  <div className={isMine ? "max-w-[70%] bg-gradient-to-br from-[#0057E7] to-[#0068FF] text-white rounded-2xl rounded-br-sm px-4 py-2.5" : "max-w-[70%] bg-white/[.06] text-white rounded-2xl rounded-bl-sm px-4 py-2.5"}>
                    <div className="text-sm">{m.content}</div>
                    <div className="text-[10px] opacity-60 mt-1 text-right">
                      {new Date(m.created_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                      {isMine && <span className="ml-1">{m.read_at ? "✓✓" : "✓"}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-white/[.08] p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Escribe un mensaje..."
                className="flex-1 px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400"
              />
              <button onClick={sendMessage} disabled={sending || !newMessage.trim()} className="w-11 h-11 rounded-lg gradient-bg text-white flex items-center justify-center disabled:opacity-50 flex-shrink-0">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="hidden lg:block w-[300px] border-l border-white/[.08] p-5 overflow-y-auto">
          <div className="text-xs font-bold tracking-[1px] uppercase text-cyan-400 mb-5">Detalles del Servicio</div>

          {serviceInfo && (
            <div className="mb-5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-[1px] uppercase text-muted2 mb-1.5"><CategoryIcon name={serviceInfo.categoryName} className="w-3.5 h-3.5" /> Servicio</div>
              <div className="text-sm font-bold">{serviceInfo.title}</div>
            </div>
          )}

          {serviceInfo?.city && (
            <div className="mb-5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-[1px] uppercase text-muted2 mb-1.5"><MapPin className="w-3.5 h-3.5" /> Ubicación</div>
              <div className="text-sm">{serviceInfo.city}</div>
            </div>
          )}

          {serviceInfo?.priceFrom && (
            <div className="mb-5">
              <div className="text-[10px] font-bold tracking-[1px] uppercase text-muted2 mb-1.5">Precio</div>
              <div className="text-sm">Desde ${serviceInfo.priceFrom}</div>
            </div>
          )}

          {provider && (
            <div className="mb-5">
              <div className="text-[10px] font-bold tracking-[1px] uppercase text-muted2 mb-1.5">Proveedor</div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-bg2 border border-white/10 flex items-center justify-center text-xs font-extrabold flex-shrink-0">
                  {provider.avatarUrl ? <img src={provider.avatarUrl} alt={provider.name} className="w-full h-full object-cover" /> : <span>{provider.name[0]}</span>}
                </div>
                <div className="text-sm font-bold flex items-center gap-1">{provider.name} {provider.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />}</div>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {serviceInfo && (serviceInfo.plan === "premium" || serviceInfo.plan === "premier") && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-400 font-bold">{serviceInfo.plan === "premier" ? "Elite" : "Plus"}</span>}
                {serviceInfo?.espanol && <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 font-bold">Se habla español</span>}
              </div>
            </div>
          )}

          {provider?.isVerified && (
            <div className="mb-5">
              <div className="text-[10px] font-bold tracking-[1px] uppercase text-muted2 mb-1.5">Verificación</div>
              <div className="flex items-center gap-1.5 text-sm text-green-400 font-semibold"><ShieldCheck className="w-4 h-4" /> Proveedor verificado</div>
            </div>
          )}

          {provider && (
            <Link href={`/provider/${provider.id}`} className="block w-full text-center py-2.5 rounded-lg border border-white/20 text-xs font-bold hover:border-cyan-400/40 transition-colors">
              Ver Perfil del Proveedor →
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
