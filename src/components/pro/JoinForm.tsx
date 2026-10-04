"use client";
import { useState } from "react";
import { createPublicClient } from "../../lib/supabase/public";
import { useProLang } from "../../lib/pro-i18n";
import { LEGAL_VERSIONS } from "../../lib/legal/versions";
import type { Specialty } from "../../../types/pro";

type Status = "idle" | "submitting" | "success" | "error";

export function JoinForm({ specialties }: { specialties: Specialty[] }) {
  const { t } = useProLang();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [specialtyInterest, setSpecialtyInterest] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) return;
    setStatus("submitting");
    const supabase = createPublicClient();
    const { error } = await supabase.from("pro_applications").insert({
      full_name: fullName,
      email,
      specialty_interest: specialtyInterest || null,
      message: message || null,
      terms_version: LEGAL_VERSIONS.terms,
      privacy_version: LEGAL_VERSIONS.privacy,
      consented_at: new Date().toISOString(),
    });
    if (error) {
      console.error("pro_applications insert failed:", error.message);
      setStatus("error");
      return;
    }
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-lg px-5 py-16 text-center md:px-8">
        <p className="text-xl font-semibold text-[var(--pro-text)]">{t.join.successTitle}</p>
        <p className="mt-2 text-sm text-[var(--pro-text-muted)]">{t.join.successBody}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-5 py-16 md:px-8">
      <h1 className="font-[family-name:var(--font-cormorant)] text-3xl italic text-[var(--pro-text)]">{t.join.title}</h1>
      <p className="mt-2 text-sm text-[var(--pro-text-muted)]">{t.join.subtitle}</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label htmlFor="join-name" className="mb-1 block text-xs font-semibold text-[var(--pro-text-muted)]">{t.join.fullNameLabel}</label>
          <input id="join-name" type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg border border-[var(--pro-line)] bg-[var(--pro-panel)] px-4 py-2.5 text-sm text-[var(--pro-text)] focus:outline-none" />
        </div>

        <div>
          <label htmlFor="join-email" className="mb-1 block text-xs font-semibold text-[var(--pro-text-muted)]">{t.join.emailLabel}</label>
          <input id="join-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-[var(--pro-line)] bg-[var(--pro-panel)] px-4 py-2.5 text-sm text-[var(--pro-text)] focus:outline-none" />
        </div>

        <div>
          <label htmlFor="join-specialty" className="mb-1 block text-xs font-semibold text-[var(--pro-text-muted)]">{t.join.specialtyLabel}</label>
          <select id="join-specialty" value={specialtyInterest} onChange={(e) => setSpecialtyInterest(e.target.value)}
            className="w-full rounded-lg border border-[var(--pro-line)] bg-[var(--pro-panel)] px-4 py-2.5 text-sm text-[var(--pro-text)] focus:outline-none">
            <option value="">{t.join.specialtyPlaceholder}</option>
            {specialties.filter((s) => s.isActive).map((s) => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
            <option value="other">{t.join.specialtyOther}</option>
          </select>
        </div>

        <div>
          <label htmlFor="join-message" className="mb-1 block text-xs font-semibold text-[var(--pro-text-muted)]">{t.join.messageLabel}</label>
          <textarea id="join-message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-lg border border-[var(--pro-line)] bg-[var(--pro-panel)] px-4 py-2.5 text-sm text-[var(--pro-text)] focus:outline-none" />
        </div>

        <label className="flex items-start gap-2 text-xs text-[var(--pro-text-muted)]">
          <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {t.join.consentLead}{" "}
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-[var(--pro-gold-bright)] hover:underline">{t.join.termsLink}</a>{" "}
            {t.join.consentAnd}{" "}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[var(--pro-gold-bright)] hover:underline">{t.join.privacyLink}</a>.
          </span>
        </label>

        {status === "error" && (
          <p className="text-sm text-red-400">{t.join.errorBody}</p>
        )}

        <button type="submit" disabled={status === "submitting" || !consent}
          className="mt-2 rounded-md bg-[var(--pro-gold)] px-4 py-3 text-sm font-semibold text-[var(--pro-navy)] transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100">
          {status === "submitting" ? t.join.submittingButton : t.join.submitButton}
        </button>
      </form>
    </div>
  );
}
