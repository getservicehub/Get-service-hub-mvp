"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read_at: string | null;
  created_at: string;
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        loadNotifications(data.user.id);
      }
    });
  }, []);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` }, (payload) => {
        setNotifications((prev) => [payload.new as Notification, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadNotifications = async (uid: string) => {
    const { data } = await supabase.from("notifications").select("id, type, title, body, link, read_at, created_at").eq("user_id", uid).order("created_at", { ascending: false }).limit(20);
    if (data) setNotifications(data);
  };

  const markAsRead = async (id: string) => {
    await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)));
  };

  if (!userId) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setOpen(!open)} className="relative w-9 h-9 rounded-lg flex items-center justify-center text-muted2 hover:text-white hover:bg-white/5 transition-all">
        <span className="text-lg">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-[320px] max-h-[400px] overflow-y-auto bg-[#0A1628] border border-white/10 rounded-2xl shadow-2xl z-[300]">
          <div className="px-4 py-3 border-b border-white/10 text-xs font-bold tracking-[1.5px] uppercase text-muted2">Notifications</div>

          {notifications.length === 0 && (
            <div className="px-4 py-8 text-center text-muted2 text-sm">No notifications yet</div>
          )}

          {notifications.map((n) => (
            <Link
              key={n.id}
              href={n.link || "#"}
              onClick={() => { markAsRead(n.id); setOpen(false); }}
              className={n.read_at ? "block px-4 py-3 border-b border-white/[.06] hover:bg-white/5" : "block px-4 py-3 border-b border-white/[.06] hover:bg-white/5 bg-cyan-400/[.04]"}
            >
              <div className="text-[13px] font-bold mb-0.5">{n.title}</div>
              {n.body && <div className="text-[11px] text-muted2 truncate">{n.body}</div>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
