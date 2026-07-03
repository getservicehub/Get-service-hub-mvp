"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5 flex items-center justify-center">
        <div className="max-w-[400px] text-center">
          <div className="text-5xl mb-5">📧</div>
          <h1 className="text-2xl font-extrabold mb-3">Check your email</h1>
          <p className="text-muted2 text-sm leading-relaxed">
            We sent a password reset link to <span className="text-white font-semibold">{email}</span>.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5 flex items-center justify-center">
      <div className="max-w-[400px] w-full">
        <h1 className="text-3xl font-extrabold mb-3 text-center">Reset Password</h1>
        <p className="text-sm text-muted2 text-center mb-8">Enter your email and we will send you a reset link.</p>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted2 mb-1.5">Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3.5 rounded-lg gradient-bg text-white font-bold text-sm disabled:opacity-50">
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center text-sm text-muted2 mt-6">
          <Link href="/login" className="text-cyan-400 font-semibold">Back to Sign In</Link>
        </div>
      </div>
    </main>
  );
}