"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, MessageCircle } from "lucide-react";

const TRUST_POINTS = [
  { Icon: ShieldCheck, title: "Trusted local professionals", desc: "Connect with verified experts in your area." },
  { Icon: MessageCircle, title: "Messages and saved providers", desc: "All your conversations in one place." },
  { Icon: Lock, title: "Secure account access", desc: "Your information is private and secure." },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

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
          <Link href="/" className="self-start">
            <Image src="/logo-horizontal.png" alt="GetServiHub" width={220} height={64} className="h-16 w-auto" />
          </Link>
          <h1 className="text-2xl font-extrabold leading-snug">
            Welcome back. <span className="text-muted2 font-semibold">Your local network is waiting.</span>
          </h1>
        </div>
      </div>

      <div className="relative hidden lg:flex lg:w-1/2 min-h-screen flex-col justify-between overflow-hidden">
        <Image src="/register-bg.jpg" alt="San Diego skyline" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060D1A] via-[#060D1A]/80 to-[#060D1A]/55" />
        <Image
          src="/logo-icon.png"
          alt=""
          width={520}
          height={520}
          className="absolute -right-24 top-[-40px] w-[520px] h-[520px] opacity-[0.06] pointer-events-none select-none z-0"
        />

        <div className="relative z-10 p-10 xl:p-14 flex flex-col h-full justify-between">
          <Link href="/">
            <Image src="/logo-horizontal.png" alt="GetServiHub" width={240} height={80} className="h-20 w-auto" />
          </Link>

          <div>
            <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight mb-3">Welcome back.</h1>
            <p className="text-xl xl:text-2xl font-semibold text-muted2 mb-6">Your local network is waiting.</p>
            <div className="w-12 h-[3px] rounded-full gradient-bg mb-9" />
            <div className="space-y-4">
              {TRUST_POINTS.map(({ Icon, title, desc }) => (
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
            New to GetServiHub?{" "}
            <Link href="/register" className="text-cyan-400 font-semibold hover:underline">Create Account</Link>
          </span>
        </div>

        <div className="flex-1 flex items-start justify-center px-5 pb-12 pt-2 lg:px-10 lg:pt-6">
          <div className="w-full max-w-[440px]">
            <div className="text-xs font-bold tracking-[2px] uppercase text-cyan-400 mb-3">Welcome Back</div>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Sign In</h2>
            <p className="text-sm text-muted2 mb-10">Sign in to continue to GetServiHub.</p>

            {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" className="w-full pl-11 pr-11 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted2">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <Link href="/forgot-password" className="text-xs text-cyan-400 font-semibold hover:underline">Forgot password?</Link>
              </div>

              <button type="submit" disabled={loading} className="w-full py-3.5 rounded-lg gradient-bg text-white font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? "Signing in..." : (<>Sign In <ArrowRight className="w-4 h-4" /></>)}
              </button>
            </form>

            <div className="text-center text-sm text-muted2 mt-6">
              Don&apos;t have an account? <Link href="/register" className="text-cyan-400 font-semibold hover:underline">Create Account</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
