"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { trackEvent } from "@/lib/tracking/events";
import { getServiceById, type ServiceCard } from "@/lib/services/queries";


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
    if (serviceData) setService(serviceData);

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

  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : null;
  const isOwnService = userId !== null && service?.provider_id === userId;

  if (loading) {
    return (
      <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
        <div className="max-w-[700px] mx-auto text-muted2 text-sm">Loading...</div>
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
      <div className="max-w-[700px] mx-auto">
        <div className="w-full h-[280px] rounded-2xl overflow-hidden flex items-center justify-center text-7xl bg-gradient-to-br from-[#0A1628] to-[#0D1A2E] mb-6">
          {hasImage && <img src={service.image_url as string} alt={service.title} className="w-full h-full object-cover" />}
          {!hasImage && <span>{service.categories?.icon || "⚡"}</span>}
        </div>

        <div className="text-xs font-bold tracking-[2px] uppercase text-cyan-400 mb-2">{service.categories?.name}</div>
        <h1 className="text-3xl font-extrabold mb-1">{name}</h1>
        <div className="text-sm text-muted2 mb-4">{service.title} - {service.city}</div>

        <div className="flex gap-2 flex-wrap mb-6">
          {service.emergency && <span className="text-[11px] px-2.5 py-1 rounded-full bg-red-500/15 text-red-400 font-bold">Emergency</span>}
          {service.espanol && <span className="text-[11px] px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-400 font-bold">Se habla espanol</span>}
          {service.price_from && <span className="text-[11px] px-2.5 py-1 rounded-full bg-green-500/15 text-green-400 font-bold">From ${service.price_from}</span>}
        </div>

        <p className="text-sm text-muted2 leading-relaxed mb-6">{service.description}</p>
        {!isOwnService && (
          <a href={`/report?service=${serviceId}`} className="text-xs text-muted2 hover:text-white underline">Report an issue with this listing</a>
        )}
        {!isOwnService && (
          <div className="mb-10">
            <button onClick={startConversation} className="w-full py-3 rounded-lg gradient-bg text-white font-bold text-sm mb-3">Message on GetServiHub</button>
            <div className="flex gap-3">
              {telLink && <a href={telLink} onClick={() => trackEvent("contact_call", serviceId)} className="flex-1 text-center py-3 rounded-lg text-sm font-bold bg-red-500 text-white">Call</a>}
              {smsLink && <a href={smsLink} onClick={() => trackEvent("contact_sms", serviceId)} className="flex-1 text-center py-3 rounded-lg text-sm font-bold bg-blue-500 text-white">Text</a>}
              {waLink && <a href={waLink} target="_blank" onClick={() => trackEvent("contact_whatsapp", serviceId)} className="flex-1 text-center py-3 rounded-lg text-sm font-bold bg-green-500 text-white">WhatsApp</a>}
            </div>
          </div>
        )}

        <div className="border-t border-white/[.08] pt-8">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-extrabold">Reviews</h2>
            {avgRating && <span className="text-sm text-amber-400 font-bold">{avgRating} stars ({reviews.length})</span>}
            {!avgRating && <span className="text-sm text-muted2">No reviews yet</span>}
          </div>

          {!userId && (
            <div className="bg-card border border-white/[.08] rounded-2xl p-5 mb-6 text-center">
              <div className="text-sm text-muted2 mb-3">Sign in to leave a review</div>
              <a href="/login" className="inline-block px-5 py-2 rounded-lg gradient-bg text-white font-semibold text-sm">Sign In</a>
            </div>
          )}

          {userId && isOwnService && (
            <div className="bg-card border border-white/[.08] rounded-2xl p-5 mb-6 text-center text-sm text-muted2">
              You cannot review your own service.
            </div>
          )}

          {userId && !isOwnService && hasReviewed && (
            <div className="bg-card border border-white/[.08] rounded-2xl p-5 mb-6 text-center text-sm text-muted2">
              You already reviewed this service.
            </div>
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
      </div>
    </main>
  );
}
