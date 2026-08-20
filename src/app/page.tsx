import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import SponsorBanner from "@/components/home/SponsorBanner";
import ConditionalSearchBar from "@/components/home/ConditionalSearchBar";
import Categories from "@/components/home/Categories";
import PlansShowcase from "@/components/home/PlansShowcase";

export const metadata: Metadata = {
  title: "GetServiHub — Find Trusted Local Services in San Diego",
  description:
    "San Diego's bilingual local services marketplace. Find verified mechanics, landscapers, cleaners, electricians, and more. English & Spanish. No commission.",
};

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "GetServiHub",
  url: "https://getservihub.com",
  logo: "https://getservihub.com/logo-horizontal.png",
  description:
    "GetServiHub is a bilingual local services marketplace connecting customers with trusted, independent service professionals in San Diego County.",
  areaServed: {
    "@type": "City",
    name: "San Diego",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA) }}
      />
      <Hero />
      <SponsorBanner />
      <ConditionalSearchBar />
      <Categories />
      <PlansShowcase />
    </main>
  );
}
