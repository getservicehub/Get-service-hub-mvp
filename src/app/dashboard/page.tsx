"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { ShieldCheck, Zap, Star, Camera, Calendar, Edit, Share2, Megaphone, ArrowRight, Plus } from "lucide-react";

type Profile = {
  business_name: string | null;
  full_name: string;
  created_at: string;
  avatar_url: string | null;
  is_verified: boolean;
};

type WeeklyStats = {
  impressions_this_week: number;
  impressions_last_week: number;
  views_this_week: number;
  views_last_week: number;
  contacts_this_week: number;
  contacts_last_week: number;
  calls_this_week: number;
  calls_last_week: number;
  whatsapp_this_week: number;
  whatsapp_last_week: number;
};

type Activity = {
  type: "message" | "review";
  text: string;
  name: string;
  time: string;
};

export default function DashboardHome() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [serviceCount, setServiceCount] = useState(0);
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [completeness, setCompleteness] = useState<{ pct: number; complete: number; total: number } | null>(null);
  const [responseStats, setResponseStats] = useState<{ replied: number; avgMin: number } | null>(null);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [weekly, setWeekly] = useState<WeeklyStats | null>(null);
  const [trend, setTrend] = useState<{ day: string; count: number }[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
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

    const { data: profileData } = await supabase
      .from("profiles")
      .select("business_name, full_name, created_at, avatar_url, is_verified")
      .eq("id", user.id)
      .single();
    if (profileData) setProfile(profileData);

    const { data: servicesData } = await supabase
      .from("services")
      .select("id, city, categories(name)")
      .eq("provider_id", user.id);

    if (servicesData) {
      setServiceCount(servicesData.length);
      if (servicesData.length > 0) {
        setCategory((servicesData[0] as any).categories?.name || "");
        setCity(servicesData[0].city || "");
      }
    }

    const { data: completenessData } = await supabase
      .from("provider_profile_completeness")
      .select("completeness_pct, items_complete, items_total")
      .eq("provider_id", user.id)
      .maybeSingle();
    if (completenessData) {
      setCompleteness({ pct: completenessData.completeness_pct, complete: completenessData.items_complete, total: completenessData.items_total });
    }

    const { data: responseData } = await supabase
      .from("provider_response_stats")
      .select("replied_conversations, avg_response_minutes")
      .eq("provider_id", user.id)
      .maybeSingle();
    if (responseData) {
      setResponseStats({ replied: responseData.replied_conversations, avgMin: Math.round(responseData.avg_response_minutes || 0) });
    }

    const serviceIds = (servicesData || []).map((s: any) => s.id);
    if (serviceIds.length > 0) {
      const { data: ratings } = await supabase.from("service_ratings").select("avg_rating, review_count").in("service_id", serviceIds);
      if (ratings && ratings.length > 0) {
        const totalReviews = ratings.reduce((sum, r) => sum + r.review_count, 0);
        const weightedSum = ratings.reduce((sum, r) => sum + r.avg_rating * r.review_count, 0);
        if (totalReviews > 0) {
          setAvgRating(Math.round((weightedSum / totalReviews) * 10) / 10);
          setReviewCount(totalReviews);
        }
      }
    }

    const { data: weeklyData } = await supabase
      .from("provider_weekly_stats")
      .select("*")
      .eq("provider_id", user.id)
      .maybeSingle();
    if (weeklyData) setWeekly(weeklyData as WeeklyStats);

    const { data: trendData } = await supabase
      .from("provider_daily_trend")
      .select("day, total_events")
      .eq("provider_id", user.id)
      .order("day");
    if (trendData) {
      setTrend(trendData.map((t: any) => ({ day: new Date(t.day).toLocaleDateString("en-US", { month: "short", day: "numeric" }), count: t.total_events })));
    }

    const { data: recentReviews } = await supabase
      .from("reviews")
      .select("rating, comment, created_at, profiles(full_name), services!inner(provider_id)")
      .eq("services.provider_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3);

    const combined: Activity[] = [];
    if (recentReviews) {
      recentReviews.forEach((r: any) => {
        combined.push({ type: "review", text: `${r.rating} star review`, name: r.profiles?.full_name || "Customer", time: r.created_at });
      });
    }
    combined.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    setActivity(combined.slice(0, 4));

    setLoading(false);
  };

  const pctChange = (curr: number, prev: number): string | null => {
    if (prev === 0) return curr > 0 ? "New" : null;
    const change = Math.round(((curr - prev) / prev) * 100);
    return change >= 0 ? `+${change}%` : `${change}%`;
  };

  const memberSince = profile ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "";
  const displayName = profile?.business_name || profile?.full_name || "";
  const showsQuickly = responseStats && responseStats.replied >= 3 && responseStats.avgMin < 60;
  const conversionRate = weekly && weekly.views_this_week > 0 ? Math.round((weekly.contacts_this_week / weekly.views_this_week) * 1000) / 10 : null;
  const maxTrend = Math.max(...trend.map((t) => t.count), 1);

  if (loading) {
    return (
      <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
        <div className="max-w-[1140px] mx-auto text-muted2 text-sm">Loading your dashboard...</div>
      </main>
    );
  }

  if (serviceCount === 0) {
    return (
      <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
        <div className="max-w-[700px] mx-auto text-center py-16">
          <div className="text-5xl mb-4">📋</div>
          <div className="text-muted2 text-sm mb-4">Publish your first service to see your dashboard come to life.</div>
          <Link href="/dashboard/new-service" className="inline-block px-5 py-2.5 rounded-lg gradient-bg text-white font-semibold text-sm">Publish Your First Service</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[1140px] mx-auto">
        <div className="relative rounded-2xl overflow-hidden mb-8 p-6">
          <div className="absolute inset-0 z-0">
            <Image src="/dashboard-header-bg.jpg" alt="" fill className="object-cover" style={{ objectPosition: "50% 45%" }} />
            <div className="absolute inset-0 bg-gradient-to-r from-[#060D1A] via-[#060D1A]/40 to-transparent" />
          </div>
          <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-extrabold mb-1">Welcome back, {displayName}! 👋</h1>
          <div className="text-sm text-muted2">{category} - {city}</div>
          <div className="text-xs text-muted2 mt-1">Member since {memberSince}</div>
        </div>
        </div>

        <div className="bg-card border border-white/[.08] rounded-2xl p-5 mb-6">
          <div className="text-xs font-bold tracking-[1px] uppercase text-cyan-400 mb-4">Your Trust Signals</div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-bg2 rounded-xl p-3.5">
              <ShieldCheck className="w-5 h-5 text-green-400 mb-2" />
              <div className="text-xs font-bold">Verified Business</div>
              <div className="text-[11px] text-muted2 mt-0.5">{profile?.is_verified ? "Verified" : "Pending review"}</div>
            </div>
            <div className="bg-bg2 rounded-xl p-3.5">
              <Zap className="w-5 h-5 text-cyan-400 mb-2" />
              <div className="text-xs font-bold">Responds Fast</div>
              <div className="text-[11px] text-muted2 mt-0.5">{showsQuickly ? `Avg ${responseStats!.avgMin} min` : "Not enough data yet"}</div>
            </div>
            <div className="bg-bg2 rounded-xl p-3.5">
              <Star className="w-5 h-5 text-amber-400 mb-2" />
              <div className="text-xs font-bold">Customer Rating</div>
              <div className="text-[11px] text-muted2 mt-0.5">{avgRating ? `${avgRating} (${reviewCount} reviews)` : "No reviews yet"}</div>
            </div>
            <div className="bg-bg2 rounded-xl p-3.5">
              <div className="text-xs font-bold mb-0.5">Profile Complete</div>
              <div className="text-lg font-extrabold text-cyan-400">{completeness?.pct || 0}%</div>
              <Link href="/account" className="text-[11px] text-cyan-400 hover:underline">Complete now →</Link>
            </div>
            <div className="bg-bg2 rounded-xl p-3.5">
              <Camera className="w-5 h-5 text-cyan-400 mb-2" />
              <div className="text-xs font-bold">Photos & Media</div>
              <div className="text-[11px] text-muted2 mt-0.5">{serviceCount} service{serviceCount !== 1 ? "s" : ""} listed</div>
            </div>
            <div className="bg-bg2 rounded-xl p-3.5">
              <Calendar className="w-5 h-5 text-cyan-400 mb-2" />
              <div className="text-xs font-bold">Active Member</div>
              <div className="text-[11px] text-muted2 mt-0.5">Since {memberSince}</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-white/[.08] rounded-2xl p-5 mb-6">
          <div className="text-xs font-bold tracking-[1px] uppercase text-cyan-400 mb-4">Business Performance</div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {[
              { label: "Impressions", curr: weekly?.impressions_this_week || 0, prev: weekly?.impressions_last_week || 0 },
              { label: "Profile Views", curr: weekly?.views_this_week || 0, prev: weekly?.views_last_week || 0 },
              { label: "Contacts", curr: weekly?.contacts_this_week || 0, prev: weekly?.contacts_last_week || 0 },
              { label: "Calls", curr: weekly?.calls_this_week || 0, prev: weekly?.calls_last_week || 0 },
              { label: "WhatsApp", curr: weekly?.whatsapp_this_week || 0, prev: weekly?.whatsapp_last_week || 0 },
            ].map((m) => {
              const change = pctChange(m.curr, m.prev);
              return (
                <div key={m.label} className="bg-bg2 rounded-xl p-3.5">
                  <div className="text-[11px] text-muted2 mb-1">{m.label}</div>
                  <div className="text-xl font-extrabold">{m.curr}</div>
                  {change && <div className={change.startsWith("+") || change === "New" ? "text-[10px] text-green-400 mt-0.5" : "text-[10px] text-red-400 mt-0.5"}>{change} vs last week</div>}
                </div>
              );
            })}
            <div className="bg-bg2 rounded-xl p-3.5">
              <div className="text-[11px] text-muted2 mb-1">Conversion Rate</div>
              <div className="text-xl font-extrabold">{conversionRate !== null ? `${conversionRate}%` : "-"}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-card border border-white/[.08] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-bold tracking-[1px] uppercase text-cyan-400">Recent Activity</div>
              <Link href="/messages" className="text-xs text-cyan-400 hover:underline">View All</Link>
            </div>
            {activity.length === 0 && <div className="text-sm text-muted2 py-6 text-center">No activity yet. Once customers start reaching out, you will see it here.</div>}
            <div className="space-y-3">
              {activity.map((a, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-xs font-extrabold flex-shrink-0">{a.name[0]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold">New review received</div>
                    <div className="text-xs text-muted2 truncate">{a.text} - from {a.name}</div>
                  </div>
                  <div className="text-[10px] text-muted2 flex-shrink-0">{new Date(a.time).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-white/[.08] rounded-2xl p-5">
            <div className="text-xs font-bold tracking-[1px] uppercase text-cyan-400 mb-4">Profile Health</div>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-3xl font-black text-cyan-400">{completeness?.pct || 0}%</div>
              <div className="text-xs text-muted2">{completeness?.complete || 0} of {completeness?.total || 6} items complete</div>
            </div>
            <div className="text-xs text-muted2 mb-3">Complete the remaining items to strengthen your profile.</div>
            <Link href="/account" className="inline-block text-sm font-semibold text-cyan-400 hover:underline">Improve Profile →</Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Link href="/dashboard/new-service" className="bg-card border border-cyan-400/20 rounded-xl p-4 text-center hover:border-cyan-400/40 transition-all">
            <Plus className="w-5 h-5 mx-auto mb-2 text-cyan-400" />
            <div className="text-xs font-semibold">New Service</div>
          </Link>
          <Link href="/account" className="bg-card border border-white/[.08] rounded-xl p-4 text-center hover:border-cyan-400/30 transition-all">
            <Edit className="w-5 h-5 mx-auto mb-2 text-cyan-400" />
            <div className="text-xs font-semibold">Edit Profile</div>
          </Link>
          <Link href="/dashboard/new-post" className="bg-card border border-white/[.08] rounded-xl p-4 text-center hover:border-cyan-400/30 transition-all">
            <Camera className="w-5 h-5 mx-auto mb-2 text-cyan-400" />
            <div className="text-xs font-semibold">Add Photos</div>
          </Link>
          <Link href="/dashboard/services" className="bg-card border border-white/[.08] rounded-xl p-4 text-center hover:border-cyan-400/30 transition-all">
            <Share2 className="w-5 h-5 mx-auto mb-2 text-cyan-400" />
            <div className="text-xs font-semibold">Manage Services</div>
          </Link>
          <Link href="/dashboard/upgrade" className="bg-card border border-amber-400/20 rounded-xl p-4 text-center hover:border-amber-400/40 transition-all">
            <Megaphone className="w-5 h-5 mx-auto mb-2 text-amber-400" />
            <div className="text-xs font-semibold text-amber-400">Promote</div>
          </Link>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Link href="/dashboard/services" className="px-5 py-2.5 rounded-lg gradient-bg text-white font-semibold text-sm">Manage Services</Link>
          <Link href="/dashboard/upgrade" className="px-5 py-2.5 rounded-lg border border-amber-400/30 text-amber-400 font-semibold text-sm inline-flex items-center gap-1.5">Upgrade Plan <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>
    </main>
  );
}
