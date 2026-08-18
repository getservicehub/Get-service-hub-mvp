import Link from "next/link";
import { Crown, ArrowLeft } from "lucide-react";

export default function ProComingSoonPage() {
  return (
    <main className="min-h-screen bg-[#0a0e17] text-white flex items-center justify-center px-5">
      <div className="max-w-[440px] text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto mb-6">
          <Crown className="w-7 h-7 text-amber-400" />
        </div>
        <div className="text-xs font-bold tracking-[2px] uppercase text-amber-400 mb-3">GetServiHub Pro</div>
        <h1 className="text-2xl md:text-3xl font-extrabold mb-4">We're building this.</h1>
        <p className="text-sm text-muted2 leading-relaxed mb-8">
          GetServiHub Pro is a verified network for licensed professionals - attorneys, architects, consultants, and more. It's not live yet, but it's coming.
        </p>
        <Link href="/" className="inline-flex items-center gap-1.5 px-6 py-3 rounded-lg border border-white/20 text-sm font-semibold hover:border-amber-400/40 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to GetServiHub
        </Link>
      </div>
    </main>
  );
}
