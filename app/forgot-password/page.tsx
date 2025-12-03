//app/forgot-password/page.tsx

"use client";

import { useState } from "react";
import DeauBitLogo from "@/components/DeauBitLogo";
import Link from "next/link";
import { Loader2, Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setMessage(""); setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-8">
         <DeauBitLogo size={60} />
      </div>

      <div className="w-full max-w-md bg-[var(--db-surface)] border-4 border-[var(--db-border)] p-8 shadow-[12px_12px_0px_0px_var(--db-border)]">
        <h1 className="text-3xl font-black uppercase mb-2 text-[var(--db-text)]">Reset Password</h1>
        <p className="text-sm font-bold text-[var(--db-text-muted)] mb-8">Don't worry, happens to the best of us.</p>

        {message ? (
          <div className="bg-[var(--db-success)] text-white border-4 border-[var(--db-border)] p-6 text-center shadow-[4px_4px_0px_0px_var(--db-border)]">
            <p className="font-black text-lg uppercase mb-2">Check Your Email!</p>
            <p className="text-sm font-medium">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="font-black text-xs uppercase mb-2 block text-[var(--db-text)]">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  className="w-full bg-[var(--db-bg)] border-2 border-[var(--db-border)] p-4 font-bold text-[var(--db-text)] focus:outline-none focus:shadow-[4px_4px_0px_0px_var(--db-border)] transition-all placeholder:text-[var(--db-text-muted)]" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  placeholder="user@example.com" 
                />
                <Mail className="absolute right-4 top-4 text-[var(--db-text-muted)] h-6 w-6" />
              </div>
            </div>

            {error && (
              <div className="bg-[var(--db-danger)] text-white font-bold p-3 border-2 border-[var(--db-border)] text-sm shadow-[4px_4px_0px_0px_var(--db-border)]">
                ❌ {error}
              </div>
            )}

            <button 
              disabled={loading} 
              className="w-full bg-[var(--db-primary)] text-[var(--db-primary-fg)] py-4 font-black uppercase border-2 border-[var(--db-border)] shadow-[4px_4px_0px_0px_var(--db-border)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--db-border)] active:translate-y-0 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin mx-auto h-6 w-6"/> : "SEND RESET LINK"}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t-4 border-dotted border-[var(--db-border)] text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-sm text-[var(--db-text)] hover:bg-[var(--db-accent)] px-2 py-1 border-2 border-transparent hover:border-[var(--db-border)] transition-all">
            <ArrowLeft className="h-4 w-4" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
