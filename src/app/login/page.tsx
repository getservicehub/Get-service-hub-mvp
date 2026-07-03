"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

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
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5 flex items-center justify-center">
      <div className="max-w-[400px] w-full">
        <div className="text-xs font-bold tracking-[2px] uppercase text-cyan-400 mb-3 text-center">Welcome Back</div>
        <h1 className="text-3xl font-extrabold mb-8 text-center">Sign In</h1>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted2 mb-1.5">Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted2 mb-1.5">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" className="w-full px-4 py-3 pr-12 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted2 text-xs font-semibold">
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="text-right">
            <Link href="/forgot-password" className="text-xs text-cyan-400 font-semibold">Forgot password?</Link>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3.5 rounded-lg gradient-bg text-white font-bold text-sm disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center text-sm text-muted2 mt-6">
          Do not have an account? <Link href="/register" className="text-cyan-400 font-semibold">Sign Up</Link>
        </div>
      </div>
    </main>
  );
}