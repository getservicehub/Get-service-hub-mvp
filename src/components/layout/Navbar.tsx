"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import NotificationBell from "./NotificationBell";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        supabase.from("profiles").select("full_name").eq("id", data.user.id).single().then(({ data: profile }) => {
          if (profile) setFullName(profile.full_name || "");
        });
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <nav className={scrolled ? "fixed top-0 left-0 right-0 z-[100] px-4 transition-all duration-300 bg-[#060D1A]/97 backdrop-blur-2xl shadow-lg" : "fixed top-0 left-0 right-0 z-[100] px-4 transition-all duration-300 bg-transparent"}>
        <div className="max-w-[1140px] mx-auto flex items-center justify-between h-[72px]">
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image src="/logo-horizontal.png" alt="GetServiHub" width={180} height={40} className="h-16 w-auto" priority />
            </Link>
            <button onClick={() => setLanguage(language === "en" ? "es" : "en")} className="w-9 h-8 rounded-lg border border-white/20 text-[11px] font-bold text-white hover:bg-white/5 transition-all flex-shrink-0">
              {language === "en" ? "ES" : "EN"}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <Link href="/find" className="px-3.5 py-2 rounded-lg text-sm font-medium text-muted2 hover:text-white hover:bg-white/5 transition-all">{t("nav_browse")}</Link>
            <Link href="/discover" className="px-3.5 py-2 rounded-lg text-sm font-medium text-muted2 hover:text-white hover:bg-white/5 transition-all">{t("nav_discover")}</Link>
            <Link href="/featured" className="px-3.5 py-2 rounded-lg text-sm font-medium text-muted2 hover:text-white hover:bg-white/5 transition-all">{t("nav_featured")}</Link>
            <Link href="/gallery" className="px-3.5 py-2 rounded-lg text-sm font-medium text-muted2 hover:text-white hover:bg-white/5 transition-all">{t("nav_gallery")}</Link>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {user && <NotificationBell />}
            {user && (
              <>
                <Link href="/dashboard" className="hidden md:inline-flex items-center text-[13px] font-semibold px-4.5 py-2 rounded-lg text-cyan-400 hover:bg-cyan-400/10 transition-all">{t("nav_dashboard")}</Link>
                <Link href="/favorites" className="hidden md:inline-flex items-center text-[13px] font-semibold px-4.5 py-2 rounded-lg text-cyan-400 hover:bg-cyan-400/10 transition-all">{t("nav_favorites")}</Link>
                <Link href="/messages" className="hidden md:inline-flex items-center text-[13px] font-semibold px-4.5 py-2 rounded-lg text-cyan-400 hover:bg-cyan-400/10 transition-all">{t("nav_messages")}</Link>
                <Link href="/account" className="hidden md:inline-flex items-center text-[13px] font-semibold px-4.5 py-2 rounded-lg text-cyan-400 hover:bg-cyan-400/10 transition-all">{t("nav_account")}</Link>
                <span className="hidden md:inline text-sm text-muted2 max-w-[100px] truncate">Hi, {fullName || user.email}</span>
                <button onClick={handleSignOut} className="hidden md:inline-flex items-center text-[13px] font-semibold px-4.5 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-all">{t("nav_signout")}</button>
              </>
            )}
            {!user && (
              <>
                <Link href="/login" className="hidden md:inline-flex items-center text-[13px] font-semibold px-4.5 py-2 rounded-lg border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 transition-all">{t("nav_signin")}</Link>
                <Link href="/register" className="hidden md:inline-flex items-center text-[13px] font-semibold px-4.5 py-2 rounded-lg gradient-bg text-white hover:opacity-90 transition-all">{t("nav_getstarted")}</Link>
              </>
            )}
            <button onClick={() => setDrawerOpen(true)} className="md:hidden flex flex-col gap-1.5 p-1.5">
              <span className="w-6 h-0.5 bg-white rounded-full" />
              <span className="w-6 h-0.5 bg-white rounded-full" />
              <span className="w-6 h-0.5 bg-white rounded-full" />
            </button>
          </div>
        </div>
      </nav>

      {drawerOpen && (
        <div className="fixed inset-0 z-[200] md:hidden">
          <div onClick={closeDrawer} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="absolute top-0 right-0 h-full w-[280px] bg-[#0A1628] border-l border-white/10 p-6 flex flex-col gap-1 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <Image src="/logo-icon.png" alt="GetServiHub" width={36} height={36} className="h-9 w-9" />
              <button onClick={closeDrawer} className="text-2xl text-muted2">×</button>
            </div>

            {user && (
              <div className="text-sm text-white font-semibold mb-4 pb-4 border-b border-white/10 truncate">Hi, {fullName || user.email}</div>
            )}

            <Link href="/find" onClick={closeDrawer} className="py-3 text-white font-medium border-b border-white/[.06]">{t("nav_browse")}</Link>
            <Link href="/discover" onClick={closeDrawer} className="py-3 text-white font-medium border-b border-white/[.06]">{t("nav_discover")}</Link>
            <Link href="/featured" onClick={closeDrawer} className="py-3 text-white font-medium border-b border-white/[.06]">{t("nav_featured")}</Link>
            <Link href="/gallery" onClick={closeDrawer} className="py-3 text-white font-medium border-b border-white/[.06]">{t("nav_gallery")}</Link>

            {user && (
              <>
                <Link href="/dashboard" onClick={closeDrawer} className="py-3 text-cyan-400 font-medium border-b border-white/[.06]">{t("nav_dashboard")}</Link>
                <Link href="/favorites" onClick={closeDrawer} className="py-3 text-cyan-400 font-medium border-b border-white/[.06]">{t("nav_favorites")}</Link>
                <Link href="/messages" onClick={closeDrawer} className="py-3 text-cyan-400 font-medium border-b border-white/[.06]">{t("nav_messages")}</Link>
                <Link href="/account" onClick={closeDrawer} className="py-3 text-cyan-400 font-medium border-b border-white/[.06]">{t("nav_account")}</Link>
                <button onClick={() => { closeDrawer(); handleSignOut(); }} className="py-3 text-left text-white font-medium mt-2">{t("nav_signout")}</button>
              </>
            )}

            {!user && (
              <div className="flex flex-col gap-3 mt-6">
                <Link href="/login" onClick={closeDrawer} className="text-center py-3 rounded-lg border border-cyan-400/30 text-cyan-400 font-semibold text-sm">{t("nav_signin")}</Link>
                <Link href="/register" onClick={closeDrawer} className="text-center py-3 rounded-lg gradient-bg text-white font-semibold text-sm">{t("nav_getstarted")}</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
