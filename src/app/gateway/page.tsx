import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Users, MapPin, MessageSquare, Lock, TrendingUp, Headset, Search, Crown, Scale, Building2, Sofa, Briefcase, HardHat, Palette, MousePointer2 } from "lucide-react";

export default function GatewayPage() {
  return (
    <main className="min-h-screen bg-[#0a0e17] text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src="/gateway-bg.jpg" alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e17]/85 via-[#0a0e17]/40 to-[#0a0e17]/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-transparent to-[#0a0e17]/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/15 via-transparent to-amber-400/15" />
      </div>

      <div className="relative z-10 flex items-center justify-between px-6 pt-6 pb-2 max-w-[1400px] mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo-icon.png" alt="GetServiHub" width={32} height={32} className="w-8 h-8" />
          <span className="text-base font-extrabold">GetServiHub</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-7 text-sm text-muted2">
          <Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link>
          <Link href="/trust-safety" className="hover:text-white transition-colors">Trust & Safety</Link>
          <Link href="/find" className="hover:text-white transition-colors">Explore</Link>
          <Link href="/resources" className="hover:text-white transition-colors">Resources</Link>
          <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <span className="text-xs text-muted2 border border-white/15 rounded-full px-3 py-1.5">EN</span>
          <Link href="/login" className="text-sm font-semibold border border-white/20 rounded-lg px-4 py-2 hover:border-white/40 transition-colors">Log in</Link>
          <Link href="/register" className="text-sm font-bold gradient-bg rounded-lg px-4 py-2 hover:opacity-90 transition-all">Get Started</Link>
        </div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 pt-8 pb-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
            Join an exclusive network of top professionals. Get quality leads, collaborate, and grow your practice.
          </p>
          <Link href="/pro" className="inline-flex items-center gap-1.5 px-7 py-3.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-[#1a1206] font-bold text-sm hover:opacity-90 transition-all">
            <Crown className="w-4 h-4" /> Join the Network
          </Link>
          <div className="mt-3"><Link href="/pro" className="text-xs font-semibold text-amber-400 hover:underline">Explore Professions →</Link></div>
        </div>
      </div>

      <div className="hidden lg:flex absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center pointer-events-none">
        <Image src="/gateway-logo.png" alt="" width={700} height={480} className="w-[420px] xl:w-[520px] h-auto drop-shadow-[0_0_60px_rgba(255,255,255,0.15)]" />
      </div>

      <div className="relative z-10 text-center pb-8 pt-4">
        <p className="text-lg md:text-xl font-extrabold mb-1.5">One Platform. One Mission.</p>
        <p className="text-sm text-muted2 mb-6">Connecting People. Empowering Professionals.</p>
        <div className="flex flex-col items-center gap-1.5 text-muted2">
          <MousePointer2 className="w-4 h-4 animate-bounce" />
          <span className="text-[11px]">Scroll to Explore</span>
        </div>
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 pb-16">
        <div className="bg-[#0d1220]/90 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)] grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold">Built on Trust</div>
              <div className="text-[10px] text-muted2">Fair rankings always</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Users className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold">Verified Professionals</div>
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
            <Lock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
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
            <Headset className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold">Real Support</div>
              <div className="text-[10px] text-muted2">Real people, real help</div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-[1300px] mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="text-xs font-bold tracking-[1.5px] uppercase text-cyan-400">Popular Service Categories</div>
          <Link href="/find" className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-white border border-white/20 rounded-full px-4 py-1.5 hover:border-white/40 transition-colors">See All Categories</Link>
          <div className="text-xs font-bold tracking-[1.5px] uppercase text-amber-400">Top Professional Categories</div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-3">
          <Link href="/find?category=Auto+Detailing" className="col-span-1 lg:col-span-2 relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-cyan-400/40 transition-all group">
            <Image src="/categories/auto-detailing.jpg" alt="Auto Detailing" fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-2 left-2 right-2 text-[11px] font-bold">Auto Detailing</div>
          </Link>
          <Link href="/find?category=Cleaning" className="col-span-1 lg:col-span-2 relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-cyan-400/40 transition-all group">
            <Image src="/categories/cleaning.jpg" alt="Cleaning" fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-2 left-2 right-2 text-[11px] font-bold">Cleaning</div>
          </Link>
          <Link href="/find?category=Landscaping" className="col-span-1 lg:col-span-2 relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-cyan-400/40 transition-all group">
            <Image src="/categories/landscaping.jpg" alt="Landscaping" fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-2 left-2 right-2 text-[11px] font-bold">Landscaping</div>
          </Link>

          <Link href="/pro" className="col-span-1 lg:col-span-2 aspect-square rounded-xl border border-amber-400/15 hover:border-amber-400/40 transition-all flex flex-col items-center justify-center gap-2 bg-[#0d1220]/60">
            <Scale className="w-7 h-7 text-amber-400" />
            <span className="text-xs font-bold">Attorneys</span>
          </Link>
          <Link href="/pro" className="col-span-1 lg:col-span-2 aspect-square rounded-xl border border-amber-400/15 hover:border-amber-400/40 transition-all flex flex-col items-center justify-center gap-2 bg-[#0d1220]/60">
            <Building2 className="w-7 h-7 text-amber-400" />
            <span className="text-xs font-bold">Architects</span>
          </Link>
          <Link href="/pro" className="col-span-1 lg:col-span-2 aspect-square rounded-xl border border-amber-400/15 hover:border-amber-400/40 transition-all flex flex-col items-center justify-center gap-2 bg-[#0d1220]/60">
            <Sofa className="w-7 h-7 text-amber-400" />
            <span className="text-xs font-bold text-center px-1">Interior Designers</span>
          </Link>
        </div>

        <Link href="/find" className="md:hidden mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-white border border-white/20 rounded-full px-4 py-1.5">See All Categories</Link>
      </div>
    </main>
  );
}
