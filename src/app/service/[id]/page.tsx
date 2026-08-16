"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { trackEvent } from "@/lib/tracking/events";
import { getServiceById, type ServiceCard } from "@/lib/services/queries";
import { CategoryIcon } from "@/lib/services/categoryIcons";
import StarRating from "@/components/ui/StarRating";
import { ShieldCheck, Zap, Edit, ExternalLink } from "lucide-react";

type Review = {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  client_id: string;
  profiles: { full_name: string } | null;
};

export default function ServiceDetailPage() {
  const params = useParams();
  const serviceId = params.id as string;
  const router = useRouter();
  const supabase = createClient();

  const [service, setService] = useState<ServiceCard | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [respondsQuickly, setRespondsQuickly] = useState(false);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    loadData();
  }, [serviceId]);

  const loadData = async () => {
    const { data: authData } = await supabase.auth.getUser();
    const currentUserId = authData.user?.id ?? null;
    setUserId(currentUserId);

    const serviceData = await getServiceById(serviceId);
    if (serviceData) {
      setService(serviceData);

      const { data: rs } = await supabase
        .from("provider_response_stats")
        .select("replied_conversations, avg_response_minutes")
        .eq("provider_id", serviceData.provider_id)
        .maybeSingle();

      if (rs) {
        setRespondsQuickly(rs.replied_conversations >= 3 && rs.avg_response_minutes < 60);
      }
    }

    const { data: reviewsData } = await supabase
      .from("reviews")
      .select("id, rating, comment, created_at, client_id, profiles(full_name)")
      .eq("service_id", serviceId)
      .order("created_at", { ascending: false });

    if (reviewsData) {
      setReviews(reviewsData as unknown as Review[]);
      if (currentUserId) {
        setHasReviewed(reviewsData.some((r: any) => r.client_id === currentUserId));
      }
    }

    setLoading(false);
  };

  const startConversation = async () => {
    if (!userId) {
      window.location.href = "/login";
      return;
    }

    trackEvent("click", serviceId, { source: "service_detail", target: "message" });

    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("client_id", userId)
      .eq("provider_id", service?.provider_id)
      .maybeSingle();

    if (existing) {
      router.push(`/messages/${existing.id}`);
      return;
    }

    const { data: newConvo, error } = await supabase
      .from("conversations")
      .insert({ client_id: userId, provider_id: service?.provider_id, service_id: serviceId })
      .select("id")
      .single();

    if (newConvo && !error) {
      router.push(`/messages/${newConvo.id}`);
    }
  };

  const submitReview = async () => {
    setReviewError("");

    if (rating === 0) {
      setReviewError("Please select a star rating");
      return;
    }

    if (!userId) {
      window.location.href = "/login";
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from("reviews").insert({
      service_id: serviceId,
      client_id: userId,
      rating,
      comment,
    });

    if (error) {
      setReviewError(error.message);
      setSubmitting(false);
      return;
    }

    setRating(0);
    setComment("");
    setSubmitting(false);
    loadData();
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) : null;
  const isOwnService = userId !== null && service?.provider_id === userId;

  if (loading) {
    return (
      <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
        <div className="max-w-[1100px] mx-auto text-muted2 text-sm">Loading...</div>
      </main>
    );
  }

  if (!service) {
    return (
      <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
        <div className="max-w-[700px] mx-auto text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <div className="text-muted2 text-sm">Service not found.</div>
        </div>
      </main>
    );
  }

  const name = service.profiles?.business_name || service.profiles?.full_name || "Provider";
  const phone = service.profiles?.phone;
  const waLink = phone ? "https://wa.me/1" + phone.replace(/\D/g, "") : null;
  const telLink = phone ? "tel:" + phone.replace(/\D/g, "") : null;
  const smsLink = phone ? "sms:" + phone.replace(/\D/g, "") : null;
  const hasImage = service.image_url !== null && service.image_url !== "";

  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
        <div>
          <div className="w-full h-[320px] rounded-2xl overflow-hidden flex items-center justify-center text-7xl bg-gradient-to-br from-[#0A1628] to-[#0D1A2E] mb-6">
            {hasImage && <img src={service.image_url as string} alt={service.title} className="w-full h-full object-cover" />}
            {!hasImage && <CategoryIcon name={service.categories?.name || ""} className="w-16 h-16" />}
          </div>

          <div className="text-xs font-bold tracking-[2px] uppercase text-cyan-400 mb-2">{service.categories?.name}</div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-extrabold">{name}</h1>
            {service.profiles?.is_verified && <ShieldCheck className="w-6 h-6 text-cyan-400" />}
          </div>
          <div className="text-sm text-muted2 mb-3">{service.title} - {service.city}</div>

          {avgRating && (
            <div className="flex items-center gap-1.5 mb-4">
              <StarRating rating={avgRating} size="text-sm" />
              <span className="text-sm text-muted2">{avgRating.toFixed(1)} ({reviews.length})</span>
            </div>
          )}

          <div className="flex gap-2 flex-wrap mb-6">
            {(service.plan === "premium" || service.plan === "premier") && <span className="text-[11px] px-2.5 py-1 rounded-full bg-amber-400/15 text-amber-400 font-bold">{service.plan === "premier" ? "Elite" : "Plus"}</span>}
            {service.emergency && <span className="text-[11px] px-2.5 py-1 rounded-full bg-red-500/15 text-red-400 font-bold">24/7 Emergency</span>}
            {respondsQuickly && <span className="text-[11px] px-2.5 py-1 rounded-full bg-green-500/15 text-green-400 font-bold flex items-center gap-1"><Zap className="w-3 h-3" /> Responde rápido</span>}
            {service.espanol && <span className="text-[11px] px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-400 font-bold">Se habla espanol</span>}
            {service.price_from && <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/[.08] text-white font-bold">Desde ${service.price_from}</span>}
          </div>

          <p className="text-sm text-muted2 leading-relaxed mb-4">{service.description}</p>

          {!isOwnService && (
            <a href={`/report?service=${serviceId}`} className="text-xs text-muted2 hover:text-white underline">Report an issue with this listing</a>
          )}
        </div>

        <div className="bg-card border border-white/[.08] rounded-2xl p-5">
          {!isOwnService ? (
            <>
              <div className="text-xs font-bold tracking-[1px] uppercase text-cyan-400 mb-4">Contactar</div>
              <button onClick={startConversation} className="w-full py-3 rounded-lg gradient-bg text-white font-bold text-sm mb-4 flex items-center justify-center gap-1.5">
                💬 Message on GetServiHub
              </button>

              {(telLink || smsLink || waLink) && (
                <>
                  <div className="text-[11px] text-muted2 mb-2">Otras formas de contacto</div>
                  <div className="flex gap-2">
                    {telLink && <a href={telLink} onClick={() => trackEvent("contact_call", serviceId, { source: "service_detail" })} className="flex-1 text-center py-2.5 rounded-lg text-xs font-bold border border-white/15 hover:border-white/30 transition-colors">Call</a>}
                    {smsLink && <a href={smsLink} onClick={() => trackEvent("contact_sms", serviceId, { source: "service_detail" })} className="flex-1 text-center py-2.5 rounded-lg text-xs font-bold border border-white/15 hover:border-white/30 transition-colors">Text</a>}
                    {waLink && <a href={waLink} target="_blank" onClick={() => trackEvent("contact_whatsapp", serviceId, { source: "service_detail" })} className="flex-1 text-center py-2.5 rounded-lg text-xs font-bold border border-white/15 hover:border-white/30 transition-colors">WhatsApp</a>}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className="text-xs font-bold tracking-[1px] uppercase text-cyan-400 mb-3">Tu Publicación</div>
              <p className="text-sm text-muted2 mb-4">Así ven los clientes esta publicación.</p>
              <Link href={`/dashboard/edit-service/${serviceId}`} className="w-full py-3 rounded-lg gradient-bg text-white font-bold text-sm mb-3 flex items-center justify-center gap-1.5">
                <Edit className="w-4 h-4" /> Editar servicio
              </Link>
              <Link href={`/provider/${service.provider_id}`} className="w-full py-2.5 rounded-lg border border-white/15 text-xs font-bold flex items-center justify-center gap-1.5 hover:border-white/30 transition-colors">
                Ver perfil público <ExternalLink className="w-3 h-3" />
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto mt-10 pt-8 border-t border-white/[.08]">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-extrabold">{isOwnService ? "Reviews from your customers" : "Reviews"}</h2>
          {avgRating && <span className="text-sm text-amber-400 font-bold">★ {avgRating.toFixed(1)} - {reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>}
          {!avgRating && <span className="text-sm text-muted2">No reviews yet</span>}
        </div>

        {!userId && (
          <div className="text-sm text-muted2 mb-6">
            <a href="/login" className="text-cyan-400 hover:underline">Sign in</a> to leave a review.
          </div>
        )}

        {userId && !isOwnService && hasReviewed && (
          <div className="text-sm text-green-400 font-semibold mb-6">✓ Ya calificaste este servicio</div>
        )}

        {userId && !isOwnService && !hasReviewed && (
          <div className="bg-card border border-white/[.08] rounded-2xl p-5 mb-6">
            <div className="text-sm font-bold mb-3">Leave a Review</div>

            {reviewError && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg p-2.5 mb-3">{reviewError}</div>}

            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setRating(star)} className={star <= rating ? "text-2xl text-amber-400" : "text-2xl text-white/20"}>
                  ★
                </button>
              ))}
            </div>

            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience..." rows={3} className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400 mb-3" />

            <button onClick={submitReview} disabled={submitting} className="px-5 py-2.5 rounded-lg gradient-bg text-white font-bold text-sm disabled:opacity-50">
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        )}

        <div className="space-y-3">
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
      </div>
    </main>
  );
}
