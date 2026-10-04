import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck, Users, MapPin, MessageSquare, Lock, TrendingUp, Headset, Search, Crown, MousePointer2,
} from "lucide-react";
import { getSpecialties } from "../../../data/pro/categories";

export const metadata: Metadata = {
  title: "GetServiHub — Local Services & Verified Professionals",
  description: "Choose your path: browse trusted local home and lifestyle services, or explore GetServiHub Pro's verified network of licensed professionals.",
};

// Gateway no tiene sistema de idioma propio (a diferencia de /pro), así que
// no usamos specialty.name (viene en español desde la DB) — mapeamos por id
// a una etiqueta en inglés fija para esta página.
const EN_LABELS: Record<string, string> = {
  law: "Attorneys",
  architecture: "Architects",
  "interior-design": "Interior Designers",
  "graphic-design": "Graphic Designers",
  accounting: "Accountants",
  photography: "Photographers",
  "real-estate": "Real Estate",
};


// Portada Gateway: solo mostramos 5 de las 7 specialties reales (teaser,
// no el catálogo completo — igual que el lado de clientes solo muestra 3
// de sus ~20 categorías reales). Las 7 siguen existiendo en el sistema.
const FEATURED_SPECIALTY_IDS = ["law", "architecture", "accounting", "real-estate", "interior-design"];

export default async function GatewayPage() {
  const allSpecialties = await getSpecialties();
  const specialties = FEATURED_SPECIALTY_IDS
    .map((id) => allSpecialties.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <main className="min-h-screen bg-[#0a0e17] text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[750px] z-0">
        <Image src="/gateway-bg.jpg" alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e17]/55 via-transparent to-[#0a0e17]/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17]/60 via-transparent to-[#0a0e17]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/15 via-transparent to-amber-400/15" />
      </div>

      <div className="relative z-10 flex items-center justify-between px-6 pt-6 pb-2 max-w-[1400px] mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo-horizontal.png" alt="GetServiHub" width={264} height={88} className="h-16 w-auto" />
        </Link>
        <nav className="hidden lg:flex items-center gap-7 text-sm text-white/90 font-medium">
          <Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link>
          <Link href="/trust-safety" className="hover:text-white transition-colors">Trust & Safety</Link>
          <Link href="/find" className="hover:text-white transition-colors">Explore</Link>
          <Link href="/resources" className="hover:text-white transition-colors">Resources</Link>
          <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <span className="text-xs text-white/70 border border-white/15 rounded-full px-3 py-1.5">EN</span>
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
          <p className="text-sm md:text-base text-white/70 leading-relaxed mb-7 max-w-[420px] mx-auto lg:mx-0">
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
          <p className="text-sm md:text-base text-white/70 leading-relaxed mb-7 max-w-[420px] mx-auto lg:ml-auto lg:mr-0">
            Join an exclusive network of top professionals. Get quality leads, collaborate, and grow your practice.
          </p>
          <Link href="/pro" className="inline-flex items-center gap-1.5 px-7 py-3.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-[#1a1206] font-bold text-sm hover:opacity-90 transition-all">
            <Crown className="w-4 h-4" /> Join the Network
          </Link>
          <div className="mt-3"><Link href="/pro" className="text-xs font-semibold text-amber-400 hover:underline">Explore Professions →</Link></div>
        </div>
      </div>


      <div className="relative z-10 text-center pb-8 pt-4">
        <p className="text-lg md:text-xl font-extrabold mb-1.5">One Platform. One Mission.</p>
        <p className="text-sm text-white/70 mb-6">Connecting People. Empowering Professionals.</p>
        <div className="flex flex-col items-center gap-1.5 text-white/70">
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
              <div className="text-[10px] text-white/70">Fair rankings always</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Users className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold">Verified Professionals</div>
              <div className="text-[10px] text-white/70">Background checked</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold">Local & Focused</div>
              <div className="text-[10px] text-white/70">Proudly serving San Diego</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold">Real Reviews</div>
              <div className="text-[10px] text-white/70">From real customers</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Lock className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold">Secure & Private</div>
              <div className="text-[10px] text-white/70">Your data stays safe</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold">No Commissions</div>
              <div className="text-[10px] text-white/70">Ever. For anyone.</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Headset className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold">Real Support</div>
              <div className="text-[10px] text-white/70">Real people, real help</div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-[1300px] mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="text-xs font-bold tracking-[1.5px] uppercase text-cyan-400">Popular Service Categories</div>
              <Link href="/find" className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-white border border-white/20 rounded-full px-4 py-1.5 hover:border-white/40 transition-colors">See All →</Link>
            </div>
            <div className="grid grid-cols-5 gap-2">
              <Link href="/find?category=Auto+Detailing" className="relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-cyan-400/40 transition-all group">
                <Image src="/categories/auto-detailing.jpg" alt="Auto Detailing" fill sizes="150px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-1.5 left-1.5 right-1.5 text-[10px] font-bold leading-tight">Auto Detailing</div>
              </Link>
              <Link href="/find?category=Cleaning" className="relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-cyan-400/40 transition-all group">
                <Image src="/categories/cleaning.jpg" alt="Cleaning" fill sizes="150px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-1.5 left-1.5 right-1.5 text-[10px] font-bold leading-tight">Cleaning</div>
              </Link>
              <Link href="/find?category=Landscaping" className="relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-cyan-400/40 transition-all group">
                <Image src="/categories/landscaping.jpg" alt="Landscaping" fill sizes="150px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-1.5 left-1.5 right-1.5 text-[10px] font-bold leading-tight">Landscaping</div>
              </Link>
              <Link href="/find?category=Remodeling" className="relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-cyan-400/40 transition-all group">
                <Image src="/categories/remodeling.jpg" alt="Remodeling" fill sizes="150px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-1.5 left-1.5 right-1.5 text-[10px] font-bold leading-tight">Remodeling</div>
              </Link>
              <Link href="/find?category=Plumber" className="relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-cyan-400/40 transition-all group">
                <Image src="/categories/plumber.jpg" alt="Plumber" fill sizes="150px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-1.5 left-1.5 right-1.5 text-[10px] font-bold leading-tight">Plumber</div>
              </Link>
            </div>
            <Link href="/find" className="md:hidden mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white border border-white/20 rounded-full px-4 py-1.5">See All Categories</Link>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="text-xs font-bold tracking-[1.5px] uppercase text-amber-400">Top Professional Categories</div>
              <Link href="/pro" className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-white border border-white/20 rounded-full px-4 py-1.5 hover:border-white/40 transition-colors">Explore →</Link>
            </div>
            {specialties.length > 0 ? (
              <div className="grid grid-cols-5 gap-2">
                {specialties.map((specialty) => (
                  <Link
                    key={specialty.id}
                    href="/pro"
                    className="relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-amber-400/40 transition-all group"
                  >
                    <Image
                      src={`/categories/${specialty.id}.jpg`}
                      alt={EN_LABELS[specialty.id] ?? specialty.name}
                      fill
                      sizes="150px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-1.5 left-1.5 right-1.5 text-[10px] font-bold leading-tight">{EN_LABELS[specialty.id] ?? specialty.name}</div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-white/50">Professional categories are temporarily unavailable.</p>
            )}
            <Link href="/pro" className="md:hidden mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white border border-white/20 rounded-full px-4 py-1.5">Explore GetServiHub Pro</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
