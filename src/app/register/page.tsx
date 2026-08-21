"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { LEGAL_VERSIONS } from "@/lib/legal/versions";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  Search,
  Briefcase,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  ShieldCheck,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

type PasswordStrength = {
  score: number;
  code: "weak" | "fair" | "good" | "strong" | null;
  color: string;
};

function getPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (password.length === 0) return { score: 0, code: null, color: "bg-white/10" };
  if (score <= 1) return { score: 1, code: "weak", color: "bg-red-500" };
  if (score <= 2) return { score: 2, code: "fair", color: "bg-amber-500" };
  if (score <= 3) return { score: 3, code: "good", color: "bg-blue-400" };
  return { score: 4, code: "strong", color: "bg-green-500" };
}

const STRENGTH_LABEL_KEYS = {
  weak: "password_strength_weak",
  fair: "password_strength_fair",
  good: "password_strength_good",
  strong: "password_strength_strong",
} as const;

const VALUE_PROPS = [
  { Icon: ShieldCheck, titleKey: "register_value_1_title", descKey: "register_value_1_desc" },
  { Icon: MessageCircle, titleKey: "register_value_2_title", descKey: "register_value_2_desc" },
  { Icon: Lock, titleKey: "register_value_3_title", descKey: "register_value_3_desc" },
] as const;

export default function RegisterPage() {
  const { language, setLanguage, t } = useLanguage();
  const [role, setRole] = useState<"provider" | "client">("client");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const strength = getPasswordStrength(password);
  const passwordsMatch = confirmPassword.length === 0 || password === confirmPassword;

  const toggleLanguage = () => setLanguage(language === "en" ? "es" : "en");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreedToTerms) {
      setError(t("register_error_terms"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("passwords_no_match"));
      return;
    }

    if (strength.score < 2) {
      setError(t("register_error_weak_password"));
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName,
          role: role,
          business_name: role === "provider" ? businessName : null,
          service_type: role === "provider" ? serviceType : null,
          terms_version: LEGAL_VERSIONS.terms,
          privacy_version: LEGAL_VERSIONS.privacy,
          community_version: LEGAL_VERSIONS.community,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <main className="min-h-screen bg-[#060D1A] text-white flex items-center justify-center px-5">
        <div className="max-w-[440px] text-center">
          <div className="text-5xl mb-5">📧</div>
          <h1 className="text-2xl font-extrabold mb-3">{t("register_success_title")}</h1>
          <p className="text-muted2 text-sm leading-relaxed">
            {t("register_success_pre")} <span className="text-white font-semibold">{email}</span>{t("register_success_post")}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#060D1A] text-white flex flex-col lg:flex-row">
      <style jsx>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: #ffffff;
          -webkit-box-shadow: 0 0 0px 1000px #0a1628 inset;
          box-shadow: 0 0 0px 1000px #0a1628 inset;
          transition: background-color 9999s ease-in-out 0s;
        }
      `}</style>

      <div className="relative lg:hidden h-[240px] w-full flex-shrink-0 overflow-hidden">
        <Image src="/register-bg.jpg" alt="San Diego skyline" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060D1A] via-[#060D1A]/70 to-[#060D1A]/30" />
        <div className="relative z-10 h-full flex flex-col justify-between p-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="self-start">
              <Image src="/logo-horizontal.png" alt="GetServiHub" width={220} height={64} className="h-16 w-auto" />
            </Link>
            <button onClick={toggleLanguage} className="w-9 h-8 rounded-lg border border-white/20 text-[11px] font-bold text-white hover:bg-white/5 transition-all flex-shrink-0">
              {language === "en" ? "ES" : "EN"}
            </button>
          </div>
          <h1 className="text-2xl font-extrabold leading-snug">
            {t("register_hero_1")} {t("register_hero_2")} <span className="text-cyan-400">{t("register_hero_3")}</span>
          </h1>
        </div>
      </div>

      <div className="relative hidden lg:flex lg:w-1/2 min-h-screen flex-col justify-between overflow-hidden">
        <Image src="/register-bg.jpg" alt="San Diego skyline" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060D1A] via-[#060D1A]/80 to-[#060D1A]/55" />
        <div className="relative z-10 p-10 xl:p-14 flex flex-col h-full justify-between">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Image src="/logo-horizontal.png" alt="GetServiHub" width={240} height={80} className="h-20 w-auto" />
            </Link>
            <button onClick={toggleLanguage} className="w-9 h-8 rounded-lg border border-white/30 text-[11px] font-bold text-white hover:bg-white/10 transition-all flex-shrink-0">
              {language === "en" ? "ES" : "EN"}
            </button>
          </div>

          <div>
            <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight mb-4">
              {t("register_hero_1")}<br />
              {t("register_hero_2")}<br />
              <span className="text-cyan-400">{t("register_hero_3")}</span>
            </h1>
            <p className="text-muted2 text-base max-w-[380px] mb-9">
              {t("register_hero_sub")}
            </p>
            <div className="space-y-4">
              {VALUE_PROPS.map(({ Icon, titleKey, descKey }) => (
                <div key={titleKey} className="flex items-start gap-3.5">
                  <span className="w-9 h-9 rounded-full border border-cyan-400/40 bg-cyan-400/10 flex items-center justify-center flex-shrink-0 text-cyan-400">
                    <Icon className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-sm font-bold">{t(titleKey)}</div>
                    <div className="text-[13px] text-muted2">{t(descKey)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div />
        </div>
      </div>

      <div className="relative w-full lg:w-1/2 flex flex-col">
        <div className="flex justify-end px-5 py-5 lg:px-10 lg:py-8">
          <span className="text-sm text-muted2">
            {t("register_have_account")}{" "}
            <Link href="/login" className="text-cyan-400 font-semibold hover:underline">{t("register_login_link")}</Link>
          </span>
        </div>

        <div className="flex-1 flex items-start justify-center px-5 pb-12 pt-2 lg:px-10 lg:pt-6">
          <div className="w-full max-w-[440px]">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-2">{t("register_title")}</h2>
            <p className="text-sm text-muted2 mb-10">
              {t("register_subtitle")}
            </p>

            {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted2 mb-2">{t("register_role_label")}</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("client")}
                    className={
                      role === "client"
                        ? "relative text-center p-4 rounded-2xl border-2 border-cyan-400 bg-cyan-400/10 shadow-[0_0_24px_rgba(34,211,238,0.15)]"
                        : "relative text-center p-4 rounded-2xl border-2 border-white/15 hover:border-white/25 transition-colors"
                    }
                  >
                    {role === "client" && (
                      <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-cyan-400 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-[#060D1A]" />
                      </span>
                    )}
                    <Search className={role === "client" ? "w-6 h-6 mx-auto mb-2 text-cyan-400" : "w-6 h-6 mx-auto mb-2 text-muted2"} />
                    <div className="text-[13px] font-bold mb-0.5">{t("register_role_client_title")}</div>
                    <div className="text-[11px] text-muted2">{t("register_role_client_desc")}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("provider")}
                    className={
                      role === "provider"
                        ? "relative text-center p-4 rounded-2xl border-2 border-cyan-400 bg-cyan-400/10 shadow-[0_0_24px_rgba(34,211,238,0.15)]"
                        : "relative text-center p-4 rounded-2xl border-2 border-white/15 hover:border-white/25 transition-colors"
                    }
                  >
                    {role === "provider" && (
                      <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-cyan-400 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-[#060D1A]" />
                      </span>
                    )}
                    <Briefcase className={role === "provider" ? "w-6 h-6 mx-auto mb-2 text-cyan-400" : "w-6 h-6 mx-auto mb-2 text-muted2"} />
                    <div className="text-[13px] font-bold mb-0.5">{t("register_role_provider_title")}</div>
                    <div className="text-[11px] text-muted2">{t("register_role_provider_desc")}</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted2 mb-1.5">{t("field_full_name_label")}</label>
                <div className="relative">
                  <User className="w-4 h-4 text-muted2 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Juan Ramirez" className="w-full pl-11 pr-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted2 mb-1.5">{t("field_email_label")}</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted2 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="w-full pl-11 pr-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted2 mb-1.5">{t("field_password_label")}</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted2 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type={showPassword ? "text" : "password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("register_password_placeholder")} className="w-full pl-11 pr-11 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted2">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1.5 mb-1.5">
                      <div className={"h-1 flex-1 rounded-full " + (strength.score >= 1 ? strength.color : "bg-white/10")}></div>
                      <div className={"h-1 flex-1 rounded-full " + (strength.score >= 2 ? strength.color : "bg-white/10")}></div>
                      <div className={"h-1 flex-1 rounded-full " + (strength.score >= 3 ? strength.color : "bg-white/10")}></div>
                      <div className={"h-1 flex-1 rounded-full " + (strength.score >= 4 ? strength.color : "bg-white/10")}></div>
                    </div>
                    <div className="text-[11px] text-muted2">{strength.code && t(STRENGTH_LABEL_KEYS[strength.code])}</div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted2 mb-1.5">{t("field_confirm_password_label")}</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted2 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type={showConfirm ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder={t("register_confirm_password_placeholder")} className={passwordsMatch ? "w-full pl-11 pr-11 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" : "w-full pl-11 pr-11 py-3 bg-bg2 border border-red-500/50 rounded-lg text-white text-sm outline-none focus:border-red-500"} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted2">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {!passwordsMatch && <div className="text-[11px] text-red-400 mt-1.5">{t("passwords_no_match")}</div>}
              </div>

              {role === "provider" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-muted2 mb-1.5">{t("field_business_name_label")}</label>
                    <input type="text" required value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Ramirez Mobile Mechanic" className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted2 mb-1.5">{t("field_service_type_label")}</label>
                    <input type="text" required value={serviceType} onChange={(e) => setServiceType(e.target.value)} placeholder="e.g. Mobile Mechanic" className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
                  </div>
                </>
              )}

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mt-0.5 w-4 h-4 flex-shrink-0" />
                <span className="text-xs text-muted2 leading-relaxed">
                  {t("register_terms_pre")} <Link href="/terms" target="_blank" className="text-cyan-400 hover:underline">{t("terms_of_service_link")}</Link>, {t("register_terms_mid")} <Link href="/privacy" target="_blank" className="text-cyan-400 hover:underline">{t("privacy_policy_link")}</Link> {t("register_terms_and")} <Link href="/community-guidelines" target="_blank" className="text-cyan-400 hover:underline">{t("community_policy_link")}</Link>.
                </span>
              </label>

              <button type="submit" disabled={loading || !agreedToTerms} className="w-full py-3.5 rounded-lg gradient-bg text-white font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? t("register_submit_loading") : (<>{t("register_submit_idle")} <ArrowRight className="w-4 h-4" /></>)}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted2 pt-1">
                <Lock className="w-3 h-3" /> {t("register_trust_line")}
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
