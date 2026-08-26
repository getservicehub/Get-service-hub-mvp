import type { Metadata } from "next";
import { Playfair_Display, Inter, IBM_Plex_Mono } from "next/font/google";
import { ProLangProvider } from "../../lib/pro-i18n";
import { ProHeader } from "../../components/pro/ProHeader";
import { ProFooter } from "../../components/pro/ProFooter";
import "../../../styles/pro-tokens.css";

const playfair = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"], weight: ["600", "700"], variable: "--font-playfair" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-inter" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-plex-mono" });

export const metadata: Metadata = {
  title: "GetServiHub Pro — Where Top Professionals Build. Connect. Grow.",
  description: "An exclusive network of verified professionals empowering your projects and your business.",
  openGraph: { title: "GetServiHub Pro", description: "An exclusive network of verified professionals.", type: "website" },
  twitter: { card: "summary_large_image", title: "GetServiHub Pro" },
};

export default function ProLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`pro-theme ${playfair.variable} ${inter.variable} ${plexMono.variable} min-h-screen bg-[var(--pro-bg)] font-sans text-[var(--pro-text)]`}>
      <ProLangProvider>
        <ProHeader />
        {children}
        <ProFooter />
      </ProLangProvider>
    </div>
  );
}
