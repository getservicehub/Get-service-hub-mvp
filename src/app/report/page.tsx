"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function ReportForm() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("service");

  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const supabase = createClient();

  const categories = [
    { id: "no_show", label: "Provider did not show up" },
    { id: "poor_quality", label: "Poor quality of work" },
    { id: "payment_issue", label: "Payment issue" },
    { id: "inappropriate", label: "Inappropriate behavior" },
    { id: "fraud", label: "Suspected fraud" },
    { id: "other", label: "Other" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!category || !description.trim()) {
      setError("Please select a category and describe the issue");
      return;
    }

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { error: insertError } = await supabase.from("reports").insert({
      reporter_id: user.id,
      service_id: serviceId || null,
      category,
      description,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5 flex items-center justify-center">
        <div className="max-w-[440px] text-center">
          <div className="text-5xl mb-5">✅</div>
          <h1 className="text-2xl font-extrabold mb-3">Report Submitted</h1>
          <p className="text-muted2 text-sm leading-relaxed">
            Thank you for letting us know. Our team will review this and follow up if needed.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[500px] mx-auto">
        <div className="text-xs font-bold tracking-[2px] uppercase text-cyan-400 mb-3">Report an Issue</div>
        <h1 className="text-3xl font-extrabold mb-3">We're here to help</h1>
        <p className="text-sm text-muted2 mb-8">Let us know what happened, and our team will look into it.</p>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted2 mb-1.5">What happened?</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400">
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted2 mb-1.5">Tell us more</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what happened..." rows={5} className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3.5 rounded-lg gradient-bg text-white font-bold text-sm disabled:opacity-50">
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg" />}>
      <ReportForm />
    </Suspense>
  );
}
