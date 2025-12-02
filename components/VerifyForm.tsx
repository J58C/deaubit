//components/VerifyForm.tsx

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck, ArrowRight } from "lucide-react";

function VerifyContent() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Verifikasi gagal");

      alert("Akun berhasil diverifikasi! Silakan login.");
      router.push("/"); 
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="db-card w-full px-5 py-5 flex flex-col">
      <div className="mb-4 text-center">
        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-[var(--db-accent-soft)] text-[var(--db-accent)] mb-2">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <h2 className="text-sm font-bold">Verifikasi Email</h2>
        <p className="text-xs db-muted mt-1">
          Masukkan kode OTP yang dikirim ke <span className="font-medium text-[var(--db-text)]">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <input
            className="db-input w-full text-center text-2xl font-mono tracking-[0.5em] py-3"
            placeholder="000000"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            required
            autoFocus
          />
        </div>

        {error && (
          <div className="p-2 text-xs text-center text-red-600 bg-red-50 border border-red-100 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || otp.length < 6}
          className="db-btn-primary w-full flex justify-center items-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verifikasi"}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>
    </div>
  );
}

export default function VerifyForm() {
  return (
    <Suspense fallback={<div className="p-4 text-center text-xs">Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}