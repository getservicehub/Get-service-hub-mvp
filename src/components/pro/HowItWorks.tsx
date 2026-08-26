"use client";
import { useProLang } from "../../lib/pro-i18n";
export function HowItWorks() {
  const { t } = useProLang();
  const steps = [
    { title: t.howItWorks.step1Title, body: t.howItWorks.step1Body },
    { title: t.howItWorks.step2Title, body: t.howItWorks.step2Body },
    { title: t.howItWorks.step3Title, body: t.howItWorks.step3Body },
    { title: t.howItWorks.step4Title, body: t.howItWorks.step4Body },
  ];
  return (
    <section id="how-it-works" className="px-5 py-14 md:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-8 text-center text-lg font-semibold text-[var(--pro-text)]">{t.howItWorks.title}</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.title}>
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--pro-gold)] font-mono text-xs font-semibold text-[var(--pro-navy)]">{i + 1}</div>
              <h4 className="text-sm font-semibold text-[var(--pro-text)]">{step.title}</h4>
              <p className="mt-1 text-xs text-[var(--pro-text-muted)]">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
