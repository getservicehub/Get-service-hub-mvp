"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Hero from "@/components/home/Hero";
import SponsorBanner from "@/components/home/SponsorBanner";
import SearchBar from "@/components/home/SearchBar";
import Categories from "@/components/home/Categories";
import PlansShowcase from "@/components/home/PlansShowcase";

export default function Home() {
  const [showSearchBar, setShowSearchBar] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase.from("profiles").select("role").eq("id", data.user.id).single().then(({ data: profile }) => {
          if (profile?.role === "client") {
            setShowSearchBar(false);
          }
        });
      }
    });
  }, []);

  return (
    <main className="min-h-screen bg-bg text-white">
      <Hero />
      <SponsorBanner />
      {showSearchBar && <SearchBar />}
      <Categories />
      <PlansShowcase />
    </main>
  );
}
