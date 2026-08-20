import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Trust & Safety — How Rankings Work | GetServiHub",
  description: "See exactly how GetServiHub decides which professionals you see. Trust is earned through track record, not paid for.",
};

export default function TrustSafetyPage() {
  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[700px] mx-auto">
        <div className="text-xs font-bold tracking-[2px] uppercase text-cyan-400 mb-3">Trust & Safety</div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-6">How we decide who you see</h1>

        <p className="text-sm text-muted2 leading-relaxed mb-8">
          Most platforms never explain how their results are ordered. We think that is backwards. Here is what actually shapes what you see on GetServiHub.
        </p>

        <div className="space-y-6">
          <div className="bg-card border border-white/[.08] rounded-2xl p-5">
            <div className="text-sm font-bold mb-2">Trust is earned, not declared</div>
            <p className="text-xs text-muted2 leading-relaxed">A profile is not trustworthy because it says so. It is trustworthy because of a consistent track record over time: response rates, completed jobs, and real reviews.</p>
          </div>

          <div className="bg-card border border-white/[.08] rounded-2xl p-5">
            <div className="text-sm font-bold mb-2">Paid plans buy visibility, never rank</div>
            <p className="text-xs text-muted2 leading-relaxed">A paid plan can increase how often a professional is seen. It can never move a lower-rated professional above a better-rated one for the same search.</p>
          </div>

          <div className="bg-card border border-white/[.08] rounded-2xl p-5">
            <div className="text-sm font-bold mb-2">New professionals get a real shot</div>
            <p className="text-xs text-muted2 leading-relaxed">We deliberately reserve visibility for professionals who are just getting started, so the same few names do not dominate every search forever.</p>
          </div>

          <div className="bg-card border border-white/[.08] rounded-2xl p-5">
            <div className="text-sm font-bold mb-2">Sponsored content is always labeled</div>
            <p className="text-xs text-muted2 leading-relaxed">Anything shown because of a paid plan is marked as Sponsored or Premium. We never present paid placement as an organic result.</p>
          </div>

          <div className="bg-card border border-white/[.08] rounded-2xl p-5">
            <div className="text-sm font-bold mb-2">Nothing is edited by hand</div>
            <p className="text-xs text-muted2 leading-relaxed">Every ranking is calculated from real activity on the platform. No one on our team can manually push a profile up or down.</p>
          </div>
        </div>

        <p className="text-xs text-muted2 leading-relaxed mt-8">
          These principles are documented in our internal Decision Engine Constitution and guide every product decision we make.
        </p>
      </div>
    </main>
  );
}
