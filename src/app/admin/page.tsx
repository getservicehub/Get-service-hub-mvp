"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type PlanRequest = {
  id: string;
  requested_plan: string;
  created_at: string;
  service_id: string;
  provider_id: string;
  profiles: { full_name: string; business_name: string | null } | null;
  services: { title: string } | null;
};

type WaitlistEntry = {
  id: string;
  created_at: string;
  provider_id: string;
  service_id: string;
  profiles: { full_name: string; business_name: string | null } | null;
  services: { title: string } | null;
};

type PendingLicense = {
  id: string;
  full_name: string;
  business_name: string | null;
  license_number: string;
};

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [requests, setRequests] = useState<PlanRequest[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [pendingLicenses, setPendingLicenses] = useState<PendingLicense[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  const checkAdminAndLoad = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();

    if (!profile?.is_admin) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    setIsAdmin(true);
    await loadData();
  };

  const loadData = async () => {
    const { data: requestsData } = await supabase
      .from("plan_requests")
      .select("id, requested_plan, created_at, service_id, provider_id, profiles(full_name, business_name), services(title)")
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    if (requestsData) setRequests(requestsData as unknown as PlanRequest[]);

    const { data: waitlistData } = await supabase
      .from("elite_waitlist")
      .select("id, created_at, provider_id, service_id, profiles(full_name, business_name), services(title)")
      .order("created_at", { ascending: true });

    if (waitlistData) setWaitlist(waitlistData as unknown as WaitlistEntry[]);

    const { data: pendingLic } = await supabase
      .from("profiles")
      .select("id, full_name, business_name, license_number")
      .eq("role", "provider")
      .eq("is_verified", false)
      .not("license_number", "is", null);

    if (pendingLic) setPendingLicenses(pendingLic as unknown as PendingLicense[]);

    setLoading(false);
  };

  const approveRequest = async (request: PlanRequest) => {
    setProcessingId(request.id);
    await supabase.from("services").update({ plan: request.requested_plan }).eq("id", request.service_id);
    await supabase.from("plan_requests").update({ status: "approved" }).eq("id", request.id);
    setRequests((prev) => prev.filter((r) => r.id !== request.id));
    setProcessingId(null);
  };

  const rejectRequest = async (requestId: string) => {
    setProcessingId(requestId);
    await supabase.from("plan_requests").update({ status: "rejected" }).eq("id", requestId);
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
    setProcessingId(null);
  };

  const approveLicense = async (profileId: string) => {
    setProcessingId(profileId);
    await supabase.from("profiles").update({ is_verified: true }).eq("id", profileId);
    setPendingLicenses((prev) => prev.filter((p) => p.id !== profileId));
    setProcessingId(null);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
        <div className="max-w-[900px] mx-auto text-muted2 text-sm">Loading...</div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <div className="text-muted2 text-sm">You do not have access to this page.</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[900px] mx-auto">
        <div className="text-xs font-bold tracking-[2px] uppercase text-cyan-400 mb-3">Admin</div>
        <h1 className="text-3xl font-extrabold mb-8">Pending Approvals</h1>

        <div className="mb-10">
          <h2 className="text-lg font-extrabold mb-4">Plan Upgrade Requests ({requests.length})</h2>
          {requests.length === 0 && (
            <div className="text-muted2 text-sm py-6 text-center bg-card border border-white/[.08] rounded-2xl">No pending requests.</div>
          )}
          <div className="space-y-3">
            {requests.map((r) => (
              <div key={r.id} className="bg-card border border-white/[.08] rounded-2xl p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold">{r.profiles?.business_name || r.profiles?.full_name}</div>
                  <div className="text-xs text-muted2">{r.services?.title} - requesting <span className="text-cyan-400 font-bold">{r.requested_plan}</span></div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => approveRequest(r)} disabled={processingId === r.id} className="px-4 py-2 rounded-lg text-xs font-bold bg-green-500 text-white disabled:opacity-50">Approve</button>
                  <button onClick={() => rejectRequest(r.id)} disabled={processingId === r.id} className="px-4 py-2 rounded-lg text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 disabled:opacity-50">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-lg font-extrabold mb-4">Elite Waitlist ({waitlist.length})</h2>
          {waitlist.length === 0 && (
            <div className="text-muted2 text-sm py-6 text-center bg-card border border-white/[.08] rounded-2xl">No one on the waitlist.</div>
          )}
          <div className="space-y-3">
            {waitlist.map((w) => (
              <div key={w.id} className="bg-card border border-amber-400/20 rounded-2xl p-4">
                <div className="text-sm font-bold">{w.profiles?.business_name || w.profiles?.full_name}</div>
                <div className="text-xs text-muted2">{w.services?.title}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-extrabold mb-4">License Verification ({pendingLicenses.length})</h2>
          {pendingLicenses.length === 0 && (
            <div className="text-muted2 text-sm py-6 text-center bg-card border border-white/[.08] rounded-2xl">No pending license verifications.</div>
          )}
          <div className="space-y-3">
            {pendingLicenses.map((p) => (
              <div key={p.id} className="bg-card border border-green-400/20 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold">{p.business_name || p.full_name}</div>
                  <div className="text-xs text-muted2">License: {p.license_number}</div>
                </div>
                <button onClick={() => approveLicense(p.id)} disabled={processingId === p.id} className="px-4 py-2 rounded-lg text-xs font-bold bg-green-500 text-white disabled:opacity-50 flex-shrink-0">Mark Verified</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
