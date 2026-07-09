"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Service = {
  id: string;
  title: string;
  description: string;
  city: string;
  is_active: boolean;
  image_url: string | null;
  categories: { name: string; icon: string } | null;
};

type Profile = {
  full_name: string;
  business_name: string | null;
  role: string;
};

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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

    const { data: profileData } = await supabase.from("profiles").select("full_name, business_name, role").eq("id", user.id).single();
    if (profileData) setProfile(profileData);

    const { data: servicesData } = await supabase
      .from("services")
      .select("id, title, description, city, is_active, image_url, categories(name, icon)")
      .eq("provider_id", user.id)
      .order("created_at", { ascending: false });

    if (servicesData) setServices(servicesData as unknown as Service[]);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service? This cannot be undone.")) return;
    setDeletingId(id);
    await supabase.from("services").delete().eq("id", id);
    setServices((prev) => prev.filter((s) => s.id !== id));
    setDeletingId(null);
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("services").update({ is_active: !current }).eq("id", id);
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, is_active: !current } : s)));
  };if (loading) {
    return (
      <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
        <div className="max-w-[900px] mx-auto text-muted2 text-sm">Loading dashboard...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[900px] mx-auto">
        <div className="text-xs font-bold tracking-[2px] uppercase text-cyan-400 mb-3">Dashboard</div>
        <h1 className="text-3xl font-extrabold mb-1">Welcome, {profile?.business_name || profile?.full_name}</h1>
        <p className="text-sm text-muted2 mb-8">Manage your published services</p>

        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-muted2">{services.length} service{services.length !== 1 ? "s" : ""} published</div>
          <Link href="/dashboard/new-service" className="px-5 py-2.5 rounded-lg gradient-bg text-white font-semibold text-sm">+ New Service</Link>
        </div>

        {services.length === 0 && (
          <div className="text-center py-16 bg-card border border-white/[.08] rounded-2xl">
            <div className="text-5xl mb-4">📋</div>
            <div className="text-muted2 text-sm mb-4">You have not published any services yet.</div>
            <Link href="/dashboard/new-service" className="inline-block px-5 py-2.5 rounded-lg gradient-bg text-white font-semibold text-sm">Publish Your First Service</Link>
          </div>
        )}

        <div className="space-y-3">
          {services.map((s) => (
            <div key={s.id} className="bg-card border border-white/[.08] rounded-2xl p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center text-2xl bg-gradient-to-br from-[#0A1628] to-[#0D1A2E] flex-shrink-0">
                {s.image_url ? <img src={s.image_url} alt={s.title} className="w-full h-full object-cover" /> : (s.categories?.icon || "⚡")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-bold">{s.title}</div>
                <div className="text-xs text-muted2">{s.categories?.name} - {s.city}</div>
                <div className="mt-1">
                  <span className={s.is_active ? "text-[11px] font-bold text-green-400" : "text-[11px] font-bold text-muted2"}>
                    {s.is_active ? "Active" : "Paused"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
             <Link href={`/dashboard/edit-service/${s.id}`} className="px-3 py-2 rounded-lg text-xs font-bold border border-cyan-400/30 text-cyan-400">Edit</Link>   
               <Link href="/dashboard/new-post" className="px-5 py-2.5 rounded-lg border border-cyan-400/30 text-cyan-400 font-semibold text-sm">📸 Post to Gallery</Link> 
                <Link href="/dashboard/upgrade" className="px-5 py-2.5 rounded-lg border border-amber-400/30 text-amber-400 font-semibold text-sm">👑 Upgrade Plan</Link>
                <button onClick={() => toggleActive(s.id, s.is_active)} className="px-3 py-2 rounded-lg text-xs font-bold border border-white/20 text-white">
                  {s.is_active ? "Pause" : "Activate"}
                </button>
                <button onClick={() => handleDelete(s.id)} disabled={deletingId === s.id} className="px-3 py-2 rounded-lg text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                  {deletingId === s.id ? "..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}