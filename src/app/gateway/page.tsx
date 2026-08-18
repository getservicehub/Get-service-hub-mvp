import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Users, MapPin, MessageSquare, Lock, TrendingUp, Headset, Search, Crown } from "lucide-react";

export default function GatewayPage() {
  return (
    <main className="min-h-screen bg-[#0a0e17] text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src="/gateway-bg.jpg" alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e17]/85 via-[#0a0e17]/40 to-[#0a0e17]/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-transparent to-[#0a0e17]/50" />
      </div>

      <div className="relative z-10 pt-8 px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/15 via-transparent to-amber-400/15" />
        <Link href="/" className="inline-flex items-center gap-2">
          <Image src="/logo-icon.png" alt="GetServiHub" width={36} height={36} className="w-9 h-9" />
          <span className="text-lg font-extrabold">GetServiHub</span>
        </Link>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 pt-12 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 bg-cyan-400/10 border border-cyan-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-cyan-400 mb-5">
            <Users className="w-3.5 h-3.5" /> FOR CUSTOMERS
          </div>
          <h1 className="text-3xl md:text-5xl font-black leading-[1.1] mb-4">
            Find Trusted <span className="text-cyan-400">Local Services</span>
          </h1>
          <p className="text-sm md:text-base text-muted2 leading-relaxed mb-7 max-w-[420px] mx-auto lg:mx-0">
            Connect with verified local professionals for your home, auto, and everyday needs. No commissions. Just real people.
          </p>
          <Link href="/" className="inline-flex items-center gap-1.5 px-7 py-3.5 rounded-lg gradient-bg text-white font-semibold text-sm hover:opacity-90 transition-all">
            <Search className="w-4 h-4" /> Find Services
          </Link>
          <div className="mt-3"><Link href="/find" className="text-xs font-semibold text-cyan-400 hover:underline">Explore Categories →</Link></div>
        </div>

        <div className="text-center lg:text-right lg:order-2">
          <div className="inline-flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-400 mb-5">
            <Crown className="w-3.5 h-3.5" /> FOR PROFESSIONALS
          </div>
          <h1 className="text-3xl md:text-5xl font-black leading-[1.1] mb-4">
            Grow Your <span className="text-amber-400">Professional Business</span>
          </h1>
          <p className="text-sm md:text-base text-muted2 leading-relaxed mb-7 max-w-[420px] mx-auto lg:ml-auto lg:mr-0">
            Join a verified network for licensed professionals. Get quality leads, build reputation, and grow your practice.
          </p>
          <Link href="/pro" className="inline-flex items-center gap-1.5 px-7 py-3.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-[#1a1206] font-bold text-sm hover:opacity-90 transition-all">
            <Crown className="w-4 h-4" /> Join the Network
          </Link>
          <div className="mt-3"><Link href="/pro" className="text-xs font-semibold text-amber-400 hover:underline">Explore Professions →</Link></div>
        </div>
      </div>

      <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center pointer-events-none">
        <Image src="/gateway-logo.png" alt="" width={200} height={140} className="w-[140px] h-auto opacity-95" />
      </div>

      <div className="relative z-10 text-center pb-10">
        <p className="text-sm text-muted2">One Platform. One Mission.</p>
        <p className="text-xs text-muted2/70">Connecting People. Empowering Professionals.</p>
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 pb-12">
        <div className="bg-[#0d1220]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-5">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold">Built on Trust</div>
              <div className="text-[10px] text-muted2">Fair rankings always</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Users className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold">Verified Pros</div>
              <div className="text-[10px] text-muted2">Background checked</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold">Local & Focused</div>
              <div className="text-[10px] text-muted2">Proudly serving San Diego</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold">Real Reviews</div>
              <div className="text-[10px] text-muted2">From real customers</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Lock className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold">Secure & Private</div>
              <div className="text-[10px] text-muted2">Your data stays safe</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold">No Commissions</div>
              <div className="text-[10px] text-muted2">Ever. For anyone.</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Headset className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold">Real Support</div>
              <div className="text-[10px] text-muted2">Real people, real help</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
