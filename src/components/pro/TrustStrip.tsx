"use client";

import { useProLang } from "../../lib/pro-i18n";
import { ProIcon } from "./icons";

export function TrustStrip() {
  const { t } = useProLang();
  const items = [
    { icon: "shield-check" as const, ...t.trustStrip.identity },
    { icon: "scale" as const, ...t.trustStrip.credentials },
    { icon: "message-circle" as const, ...t.trustStrip.reviews },
    { icon: "lock" as const, ...t.trustStrip.pricing },
  ];
  return (
    <section className="px-5 py-10 md:px-8">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.title} className="flex items-start gap-3">
            <ProIcon name={item.icon} className="mt-0.5 h-5 w-5 shrink-0 text-[var(--pro-gold-bright)]" />
            <div>
              <h4 className="text-sm font-semibold text-[var(--pro-text)]">{item.title}</h4>
              <p className="text-xs text-[var(--pro-text-muted)]">{item.body}</p>
              <a href="/pro#trust" className="mt-1 inline-block text-xs text-[var(--pro-gold-bright)] hover:underline">
                {t.trustStrip.howItWorksLink} →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
