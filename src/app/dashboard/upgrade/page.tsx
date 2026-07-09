"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type MyService = { id: string; title: string; plan: string };

export default function UpgradePage() {
  const [services, setServices] = useState<MyService[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [pendingRequest, setPendingRequest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data: myServices } = await supabase.from("services").select("id, title, plan").eq("provider_id", user.id);
    if (myServices) {
      setServices(myServices);
      if (myServices.length > 0) setSelectedServiceId(myServices[0].id);
    }

    const { data: requests } = await supabase.from("plan_requests").select("id").eq("provider_id", user.id).eq("status", "pending");
    if (requests && requests.length > 0) setPendingRequest(true);

    setLoading(false);
  };

  const submitRequest = async () => {
    if (!selectedPlan || !selectedServiceId) return;
    setSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("plan_requests").insert({
      provider_id: user.id,
      service_id: selectedServiceId,
      requested_plan: selectedPlan,
    });

    if (!error) {
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  const plans = [
    { id: "pro", name: "Pro", price: "$29", desc: "Featured badge + priority placement", color: "border-cyan-400/30" },
    { id: "premium", name: "Premium", price: "$59", desc: "Weekly rotation in Featured (top results)", color: "border-blue-400/30" },
    { id: "premier", name: "Premier", price: "$199", desc: "Only 3 spots total. Maximum exclusivity.", color: "border-amber-400/30" },
  ];

  if (loading) {
    return (
      <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
        <div className="max-w-[700px] mx-auto text-muted2 text-sm">Loading...</div>
      </main>
    );
  }

  if (services.length === 0) {
    return (
      <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
        <div className="max-w-[700px] mx-auto text-center py-16">
          <div className="text-5xl mb-4">📋</div>
          <div className="text-muted2 text-sm">Publish a service first before upgrading your plan.</div>
        </div>
      </main>
    );
  }

  if (submitted || pendingRequest) {
    return (
      <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5 flex items-center justify-center">
        <div className="max-w-[440px] text-center">
          <div className="text-5xl mb-5">⏳</div>
          <h1 className="text-2xl font-extrabold mb-3">Request Received</h1>
          <p className="text-muted2 text-sm leading-relaxed">
            We will contact you shortly to complete payment and activate your new plan. Thanks for growing with GetServiHub.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[700px] mx-auto">
        <div className="text-xs font-bold tracking-[2px] uppercase text-cyan-400 mb-3">Grow Your Business</div>
        <h1 className="text-3xl font-extrabold mb-8">Upgrade Your Plan</h1>

        {services.length > 1 && (
          <div className="mb-6">
            <label className="block text-xs font-semibold text-muted2 mb-1.5">Which service?</label>
            <select value={selectedServiceId} onChange={(e) => setSelectedServiceId(e.target.value)} className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400">
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.title} (currently {s.plan})</option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {plans.map((plan) => (
            <button key={plan.id} onClick={() => setSelectedPlan(plan.id)} className={selectedPlan === plan.id ? "text-left bg-card border-2 " + plan.color + " rounded-2xl p-5" : "text-left bg-card border-2 border-white/10 rounded-2xl p-5"}>
              <div className="text-lg font-extrabold mb-1">{plan.name}</div>
              <div className="text-2xl font-black mb-2">{plan.price}<span className="text-xs font-medium text-muted2">/mo</span></div>
              <div className="text-xs text-muted2">{plan.desc}</div>
            </button>
          ))}
        </div>

        <button onClick={submitRequest} disabled={!selectedPlan || submitting} className="w-full py-3.5 rounded-lg gradient-bg text-white font-bold text-sm disabled:opacity-50">
          {submitting ? "Submitting..." : "Request Upgrade"}
        </button>
      </div>
    </main>
  );
}
