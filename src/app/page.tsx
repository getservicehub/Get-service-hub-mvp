import Hero from "@/components/home/Hero";
import SponsorBanner from "@/components/home/SponsorBanner";
import SearchBar from "@/components/home/SearchBar";
import Categories from "@/components/home/Categories";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-white">
      <Hero />
      <SponsorBanner />
      <SearchBar />
      <Categories />
    </main>
  );
}