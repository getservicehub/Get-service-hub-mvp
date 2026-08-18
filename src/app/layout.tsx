import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "GetServiHub — Find. Connect. Grow.",
  description:
    "San Diego's bilingual local services marketplace. Find trusted mechanics, landscapers, cleaners & more in your community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
       <LanguageProvider>
          <Navbar />
          <Sidebar />
          <LayoutWrapper>
            {children}
            <Footer />
          </LayoutWrapper>
        </LanguageProvider>
      </body>
    </html>
  );
}