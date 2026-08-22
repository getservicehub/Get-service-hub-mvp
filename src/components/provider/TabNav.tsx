"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabNav({ providerId }: { providerId: string }) {
  const pathname = usePathname();
  const base = `/provider/${providerId}`;
  const tabs = [
    { href: base, label: "Services" },
    { href: `${base}/gallery`, label: "Gallery" },
    { href: `${base}/reviews`, label: "Reviews" },
  ];

  return (
    <div className="flex gap-2 mb-6 border-b border-white/[.08]">
      {tabs.map((t) => {
        const isActive = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={
              isActive
                ? "px-4 py-3 text-sm font-bold text-cyan-400 border-b-2 border-cyan-400"
                : "px-4 py-3 text-sm font-bold text-muted2"
            }
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
