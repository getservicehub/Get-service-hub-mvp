"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/discover", label: "Discover Pros", icon: "🔭" },
  { href: "/featured", label: "Featured Pros", icon: "⭐" },
  { href: "/gallery", label: "Work Gallery", icon: "📸" },
  { href: "/find", label: "Directory", icon: "🗂️" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex fixed top-[72px] left-0 bottom-0 w-[72px] hover:w-[220px] z-[90] bg-[#060D1A]/97 border-r border-white/[.08] flex-col items-center py-4 gap-1 transition-all duration-300 overflow-hidden group">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`w-full flex items-center gap-3.5 px-5 py-2.5 whitespace-nowrap transition-all relative ${
              active
                ? "text-cyan-400 bg-cyan-400/[.06]"
                : "text-muted2 hover:bg-blue-500/[.07] hover:text-white"
            }`}
          >
            {active && (
              <span className="absolute left-0 top-0 bottom-0 w-[3px] gradient-bg rounded-r" />
            )}
            <span className="w-8 h-8 rounded-[10px] bg-white/[.04] flex items-center justify-center text-[17px] flex-shrink-0">
              {item.icon}
            </span>
            <span className="text-[13px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              {item.label}
            </span>
          </Link>
        );
      })}
    </aside>
  );
}