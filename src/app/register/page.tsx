"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { LEGAL_VERSIONS } from "@/lib/legal/versions";
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

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (password.length === 0) return { score: 0, label: "", color: "bg-white/10" };
  if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-500" };
  if (score <= 2) return { score: 2, label: "Fair", color: "bg-amber-500" };
  if (score <= 3) return { score: 3, label: "Good", color: "bg-blue-400" };
  return { score: 4, label: "Strong", color: "bg-green-500" };
}

const VALUE_PROPS = [
  { Icon: ShieldCheck, title: "Trusted Professionals", desc: "Real reviews from real customers." },
  { Icon: MessageCircle, title: "Easy Communication", desc: "Message providers directly, in English or Spanish." },
  { Icon: Lock, title: "Secure & Protected", desc: "Your information stays private and secure." },
];

export default function RegisterPage() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreedToTerms) {
      setError("Please agree to the Terms of Service, Privacy Policy, and Community Guidelines to continue.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (strength.score < 2) {
      setError("Please choose a stronger password");
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
          <h1 className="text-2xl font-extrabold mb-3">Check your email</h1>
          <p className="text-muted2 text-sm leading-relaxed">
            We sent a confirmation link to <span className="text-white font-semibold">{email}</span>. Click it to activate your account and sign in.
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

      <div className="relative lg:hidden h-[200px] w-full flex-shrink-0 overflow-hidden">
        <Image src="/register-bg.jpg" alt="San Diego skyline" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060D1A] via-[#060D1A]/70 to-[#060D1A]/30" />
        <div className="relative z-10 h-full flex flex-col justify-between p-5">
          <Link href="/" className="self-start">
            <Image src="/logo-horizontal.png" alt="GetServiHub" width={140} height={32} className="h-8 w-auto" />
          </Link>
          <h1 className="text-xl font-extrabold leading-snug">
            Real People. Real Services. <span className="text-cyan-400">Real Trust.</span>
          </h1>
        </div>
      </div>

      <div className="relative hidden lg:flex lg:w-1/2 min-h-screen flex-col justify-between overflow-hidden">
        <Image src="/register-bg.jpg" alt="San Diego skyline" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060D1A] via-[#060D1A]/80 to-[#060D1A]/55" />
        <div className="relative z-10 p-10 xl:p-14 flex flex-col h-full justify-between">
          <Link href="/">
            <Image src="/logo-horizontal.png" alt="GetServiHub" width={240} height={80} className="h-20 w-auto" />
          </Link>

          <div>
            <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight mb-4">
              Real People.<br />
              Real Services.<br />
              <span className="text-cyan-400">Real Trust.</span>
            </h1>
            <p className="text-muted2 text-base max-w-[380px] mb-9">
              Connect with trusted local professionals across San Diego County — bilingual, and built for the community.
            </p>
            <div className="space-y-4">
              {VALUE_PROPS.map(({ Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3.5">
                  <span className="w-9 h-9 rounded-full border border-cyan-400/40 bg-cyan-400/10 flex items-center justify-center flex-shrink-0 text-cyan-400">
                    <Icon className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-sm font-bold">{title}</div>
                    <div className="text-[13px] text-muted2">{desc}</div>
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
            Already have an account?{" "}
            <Link href="/login" className="text-cyan-400 font-semibold hover:underline">Log in</Link>
          </span>
        </div>

        <div className="flex-1 flex items-start justify-center px-5 pb-12 pt-2 lg:px-10 lg:pt-6">
          <div className="w-full max-w-[440px]">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Create Your Account</h2>
            <p className="text-sm text-muted2 mb-10">
              Join GetServiHub to connect with local professionals — or grow your business by offering your services.
            </p>

            {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted2 mb-2">I'm here to...</label>
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
                    <div className="text-[13px] font-bold mb-0.5">I'm looking for a service</div>
                    <div className="text-[11px] text-muted2">Find trusted local professionals.</div>
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
                    <div className="text-[13px] font-bold mb-0.5">I offer services</div>
                    <div className="text-[11px] text-muted2">Create your business profile.</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted2 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-muted2 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Juan Ramirez" className="w-full pl-11 pr-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted2 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted2 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="w-full pl-11 pr-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted2 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted2 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type={showPassword ? "text" : "password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className="w-full pl-11 pr-11 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
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
                    <div className="text-[11px] text-muted2">{strength.label}</div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted2 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted2 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type={showConfirm ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" className={passwordsMatch ? "w-full pl-11 pr-11 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" : "w-full pl-11 pr-11 py-3 bg-bg2 border border-red-500/50 rounded-lg text-white text-sm outline-none focus:border-red-500"} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted2">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {!passwordsMatch && <div className="text-[11px] text-red-400 mt-1.5">Passwords do not match</div>}
              </div>

              {role === "provider" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-muted2 mb-1.5">Business Name</label>
                    <input type="text" required value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Ramirez Mobile Mechanic" className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted2 mb-1.5">Service Type</label>
                    <input type="text" required value={serviceType} onChange={(e) => setServiceType(e.target.value)} placeholder="e.g. Mobile Mechanic" className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
                  </div>
                </>
              )}

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mt-0.5 w-4 h-4 flex-shrink-0" />
                <span className="text-xs text-muted2 leading-relaxed">
                  I am at least 18 years old, agree to the <Link href="/terms" target="_blank" className="text-cyan-400 hover:underline">Terms of Service</Link>, and acknowledge the <Link href="/privacy" target="_blank" className="text-cyan-400 hover:underline">Privacy Policy</Link> and <Link href="/community-guidelines" target="_blank" className="text-cyan-400 hover:underline">Community, Reviews &amp; Content Policy</Link>.
                </span>
              </label>

              <button type="submit" disabled={loading || !agreedToTerms} className="w-full py-3.5 rounded-lg gradient-bg text-white font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? "Creating account..." : (<>Create Account <ArrowRight className="w-4 h-4" /></>)}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted2 pt-1">
                <Lock className="w-3 h-3" /> Your information is safe and secure
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
