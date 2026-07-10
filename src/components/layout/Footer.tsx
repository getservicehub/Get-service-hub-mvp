import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-bg2 border-t border-white/[.08] pt-14 pb-8 px-5">
      <div className="max-w-[1140px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <Image src="/logo-horizontal.png" alt="GetServiHub" width={160} height={36} className="h-8 w-auto mb-3" />
          <p className="text-xs text-muted2 leading-relaxed mb-3">
            San Diego's bilingual marketplace for local services. Built on trust, transparency, and fair competition.
          </p>
          <div className="text-[11px] font-bold tracking-[2px] text-cyan-400">FIND. CONNECT. GROW.</div>
        </div>

        <div>
          <div className="text-[11px] font-bold tracking-[1.5px] uppercase text-muted2 mb-4">Explore</div>
          <div className="flex flex-col gap-2.5">
            <Link href="/directory" className="text-xs text-muted2 hover:text-white">Directory</Link>
            <Link href="/discover" className="text-xs text-muted2 hover:text-white">Discover</Link>
            <Link href="/featured" className="text-xs text-muted2 hover:text-white">Featured</Link>
            <Link href="/gallery" className="text-xs text-muted2 hover:text-white">Gallery</Link>
          </div>
        </div>

        <div>
          <div className="text-[11px] font-bold tracking-[1.5px] uppercase text-muted2 mb-4">Company</div>
          <div className="flex flex-col gap-2.5">
            <Link href="/about" className="text-xs text-muted2 hover:text-white">About Us</Link>
            <Link href="/trust-safety" className="text-xs text-muted2 hover:text-white">Trust & Safety</Link>
            <Link href="/contact" className="text-xs text-muted2 hover:text-white">Contact</Link>
            <Link href="/report" className="text-xs text-muted2 hover:text-white">Report an Issue</Link>
            <Link href="/register" className="text-xs text-muted2 hover:text-white">List Your Business</Link>
          </div>
        </div>

        <div>
          <div className="text-[11px] font-bold tracking-[1.5px] uppercase text-muted2 mb-4">Legal</div>
          <div className="flex flex-col gap-2.5">
            <Link href="/terms" className="text-xs text-muted2 hover:text-white">Terms of Service</Link>
            <Link href="/privacy" className="text-xs text-muted2 hover:text-white">Privacy Policy</Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1140px] mx-auto mt-10 pt-6 border-t border-white/[.08] flex flex-col md:flex-row justify-between items-center gap-3">
        <span className="text-[11px] text-muted2">© {new Date().getFullYear()} GetServiHub. All rights reserved.</span>
        <span className="text-[11px] text-muted2">hello@getservihub.com</span>
      </div>
    </footer>
  );
}
