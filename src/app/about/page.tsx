import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[700px] mx-auto">
        <div className="text-xs font-bold tracking-[2px] uppercase text-cyan-400 mb-3">About Us</div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-6">A platform built on trust, transparency, and fair competition</h1>

        <div className="space-y-5 text-sm text-muted2 leading-relaxed">
          <p>
            GetServiHub started with a simple frustration: finding a trustworthy local professional in San Diego meant scrolling through Facebook groups, hoping someone would answer, and having no real way to verify who you were hiring.
          </p>
          <p>
            We built something different. A bilingual marketplace where clients can find verified local pros in English or Spanish, and where professionals can grow their business without paying a commission on every job.
          </p>
          <p>
            But GetServiHub is not just a directory. Every decision about who appears where, how trust is measured, and how new professionals get discovered follows a written set of principles we call our Decision Engine Constitution. It exists so that trust on this platform is earned through real behavior, not bought outright, and so professionals of every size have a genuine chance to be found.
          </p>
          <p>
            We are based in San Diego, and we are building for San Diego first. No commission fees. No middlemen. Just real people finding real help.
          </p>
        </div>

        <div className="mt-10 pt-8 border-t border-white/[.08]">
          <Link href="/trust-safety" className="text-cyan-400 text-sm font-semibold">Learn how our platform works →</Link>
        </div>
      </div>
    </main>
  );
}
