//app/forgot-password/page.tsx

"use client";
import { useState } from "react";
import DeauBitLogo from "@/components/DeauBitLogo";
import Link from "next/link";
import { Loader2, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

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
      setError(err instanceof Error ? err.message : "Gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="db-shell w-full max-w-md mx-auto p-6 db-animate-login">
      <div className="flex flex-col items-center gap-4 mb-6">
        <DeauBitLogo size={40} />
        <h1 className="text-lg font-bold">Lupa Password</h1>
      </div>

      <div className="db-card p-5">
        {message ? (
          <div className="text-center text-sm text-green-600 bg-green-50 p-4 rounded-lg">
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1">Email Anda</label>
              <input 
                type="email" 
                className="db-input w-full" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="nama@email.com"
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button disabled={loading} className="db-btn-primary w-full flex justify-center py-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin"/> : "Kirim Link Reset"}
            </button>
          </form>
        )}
      </div>
      
      <div className="mt-4 text-center text-xs">
        <Link href="/" className="db-muted hover:text-[var(--db-accent)]">Kembali ke Login</Link>
      </div>
    </div>
  );
}