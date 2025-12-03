//components/VerifyForm.tsx

"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";

function VerifyContent() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => { if (searchParams.get("email")) setEmail(searchParams.get("email")!); }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      const res = await fetch("/api/auth/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, otp }) });
      if (!res.ok) throw new Error("Invalid OTP");
      alert("Verified!"); router.push("/");
    } catch (err) { setError(err instanceof Error ? err.message : "Error"); } finally { setLoading(false); }
  }

  return (
    <div className="bg-[var(--db-surface)] border-4 border-[var(--db-border)] p-8 shadow-[8px_8px_0px_0px_var(--db-border)] text-center">
      <div className="inline-block p-3 bg-[var(--db-success)] border-2 border-[var(--db-border)] rounded-full mb-4"><ShieldCheck className="h-8 w-8 text-white"/></div>
      <h2 className="text-2xl font-black uppercase text-[var(--db-text)] mb-1">VERIFY EMAIL</h2>
      <p className="text-xs font-bold text-[var(--db-text-muted)] mb-6">Code sent to {email}</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full text-center text-3xl font-mono font-bold tracking-[0.5em] py-4 bg-[var(--db-bg)] border-4 border-[var(--db-border)] focus:outline-none focus:shadow-[4px_4px_0px_0px_var(--db-border)] text-[var(--db-text)]" 
            placeholder="000000" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} autoFocus />
        
        {error && <div className="bg-red-500 text-white font-bold text-xs p-2 border-2 border-[var(--db-border)]">{error}</div>}
        
        <button type="submit" disabled={loading || otp.length < 6} className="w-full bg-[var(--db-primary)] text-white py-3 font-black uppercase border-2 border-[var(--db-border)] shadow-[4px_4px_0px_0px_var(--db-border)] hover:-translate-y-1 transition-all disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin mx-auto"/> : "CONFIRM"}
        </button>
      </form>
    </div>
  );
}

export default function VerifyForm() { return <Suspense><VerifyContent/></Suspense>; }