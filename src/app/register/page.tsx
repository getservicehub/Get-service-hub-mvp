"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

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

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        email: email,
        full_name: fullName,
        role: role,
        business_name: role === "provider" ? businessName : null,
        service_type: role === "provider" ? serviceType : null,
      });

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }
    }

    setSuccess(true);
    setLoading(false);
  };if (success) {
    return (
      <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5 flex items-center justify-center">
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
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[440px] mx-auto">
        <div className="text-xs font-bold tracking-[2px] uppercase text-cyan-400 mb-3 text-center">Get Started</div>
        <h1 className="text-3xl font-extrabold mb-8 text-center">Create Your Account</h1>

        <div className="flex gap-3 mb-6">
          <button type="button" onClick={() => setRole("client")} className={role === "client" ? "flex-1 border-2 border-cyan-400 bg-cyan-400/10 rounded-2xl p-4 text-center" : "flex-1 border-2 border-white/20 rounded-2xl p-4 text-center"}>
            <div className="text-3xl mb-2">🏠</div>
            <div className="text-[13px] font-bold">Looking for Services</div>
          </button>
          <button type="button" onClick={() => setRole("provider")} className={role === "provider" ? "flex-1 border-2 border-cyan-400 bg-cyan-400/10 rounded-2xl p-4 text-center" : "flex-1 border-2 border-white/20 rounded-2xl p-4 text-center"}>
            <div className="text-3xl mb-2">🔧</div>
            <div className="text-[13px] font-bold">Service Provider</div>
          </button>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 mb-4">{error}</div>}<form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted2 mb-1.5">Full Name</label>
            <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Juan Ramirez" className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted2 mb-1.5">Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted2 mb-1.5">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className="w-full px-4 py-3 pr-12 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted2 text-xs font-semibold">
                {showPassword ? "Hide" : "Show"}
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
              <input type={showConfirm ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" className={passwordsMatch ? "w-full px-4 py-3 pr-12 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" : "w-full px-4 py-3 pr-12 bg-bg2 border border-red-500/50 rounded-lg text-white text-sm outline-none focus:border-red-500"} />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted2 text-xs font-semibold">
                {showConfirm ? "Hide" : "Show"}
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
          <button type="submit" disabled={loading || !agreedToTerms} className="w-full py-3.5 rounded-lg gradient-bg text-white font-bold text-sm disabled:opacity-50">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
      </div>
    </main>
  );
}