import Link from "next/link";
import { CategoryIcon } from "@/lib/services/categoryIcons";

type Service = {
  id: string;
  title: string;
  city: string;
  image_url: string | null;
  categories: { name: string; icon: string } | null;
};

export default function ServicesGrid({ services }: { services: Service[] }) {
  if (services.length === 0) {
    return <div className="text-muted2 text-sm py-10 text-center">No active services.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {services.map((s) => {
        const hasImage = s.image_url !== null && s.image_url !== "";
        return (
          <Link key={s.id} href={`/service/${s.id}`} className="block bg-card border border-white/[.08] rounded-2xl overflow-hidden hover:border-white/20 transition-all">
            <div className="w-full h-[140px] flex items-center justify-center text-cyan-400 bg-gradient-to-br from-[#0A1628] to-[#0D1A2E] overflow-hidden">
              {hasImage && <img src={s.image_url as string} alt={s.title} className="w-full h-full object-cover" />}
              {!hasImage && <CategoryIcon name={s.categories?.name || ""} className="w-10 h-10" />}
            </div>
            <div className="p-4">
              <div className="text-sm font-bold mb-1">{s.title}</div>
              <div className="text-xs text-muted2">{s.categories?.name} - {s.city}</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
