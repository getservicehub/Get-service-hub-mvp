"use client";

import { usePathname } from "next/navigation";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBare = pathname?.startsWith("/gateway") || pathname?.startsWith("/pro") || pathname === "/register" || pathname === "/login";

  return <div className={isBare ? "" : "md:ml-[72px]"}>{children}</div>;
}
