"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import SearchBar from "@/components/home/SearchBar";

export default function ConditionalSearchBar() {
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

  if (!showSearchBar) return null;
  return <SearchBar />;
}
