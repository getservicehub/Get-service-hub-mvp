"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
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
  };return (
    <>
      <nav className={scrolled ? "fixed top-0 left-0 right-0 z-[100] px-6 transition-all duration-300 bg-[#060D1A]/97 backdrop-blur-2xl shadow-lg" : "fixed top-0 left-0 right-0 z-[100] px-6 transition-all duration-300 bg-transparent"}>
        <div className="max-w-[1140px] mx-auto flex items-center justify-between h-[72px]">
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image src="/logo-horizontal.png" alt="GetServiHub" width={180} height={40} className="h-14 w-auto" priority />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link href="/directory" className="px-3.5 py-2 rounded-lg text-sm font-medium text-muted2 hover:text-white hover:bg-white/5 transition-all">Browse Services</Link>
            <Link href="/discover" className="px-3.5 py-2 rounded-lg text-sm font-medium text-muted2 hover:text-white hover:bg-white/5 transition-all">Discover</Link>
            <Link href="/featured" className="px-3.5 py-2 rounded-lg text-sm font-medium text-muted2 hover:text-white hover:bg-white/5 transition-all">Featured</Link>
            <Link href="/gallery" className="px-3.5 py-2 rounded-lg text-sm font-medium text-muted2 hover:text-white hover:bg-white/5 transition-all">Gallery</Link>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            {user ? (
              <>
                <Link href="/dashboard" className="hidden md:inline-flex items-center text-[13px] font-semibold px-4.5 py-2 rounded-lg text-cyan-400 hover:bg-cyan-400/10 transition-all">Dashboard</Link>
                <Link href="/favorites" className="hidden md:inline-flex items-center text-[13px] font-semibold px-4.5 py-2 rounded-lg text-cyan-400 hover:bg-cyan-400/10 transition-all">Favorites</Link>
                <Link href="/account" className="hidden md:inline-flex items-center text-[13px] font-semibold px-4.5 py-2 rounded-lg text-cyan-400 hover:bg-cyan-400/10 transition-all">Account</Link>
                <span className="hidden md:inline text-sm text-muted2">Hi, {fullName || user.email}</span>
                <button onClick={handleSignOut} className="hidden md:inline-flex items-center text-[13px] font-semibold px-4.5 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-all">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden md:inline-flex items-center text-[13px] font-semibold px-4.5 py-2 rounded-lg border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 transition-all">Sign In</Link>
                <Link href="/register" className="hidden md:inline-flex items-center text-[13px] font-semibold px-4.5 py-2 rounded-lg gradient-bg text-white hover:opacity-90 transition-all">Get Started</Link>
              </>
            )}
            <button onClick={() => setDrawerOpen(true)} className="md:hidden flex flex-col gap-1.5 p-1.5">
              <span className="w-5.5 h-0.5 bg-white rounded-full" />
              <span className="w-5.5 h-0.5 bg-white rounded-full" />
              <span className="w-5.5 h-0.5 bg-white rounded-full" />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}