//app/setup/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, Server, KeyRound, RefreshCw } from "lucide-react";
import DeauBitLogo from "@/components/DeauBitLogo";

export default function SetupPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"form" | "otp">("form");
  const router = useRouter();

  const [formData, setFormData] = useState({ name: "Administrator", email: "", password: "" });
  const [otp, setOtp] = useState("");
  
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    fetch("/api/setup/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.initialized) router.replace("/");
        else setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    if (resendCooldown > 0) {
        const timer = setInterval(() => setResendCooldown(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  async function handleSetup(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setStep("otp");
      setResendCooldown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
      if (resendCooldown > 0) return;
      setResendLoading(true); setError("");
      try {
          const res = await fetch("/api/auth/resend-otp", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: formData.email })
          });
          if(!res.ok) throw new Error("Failed to resend");
          setResendCooldown(60);
          alert("New code sent to your email.");
      } catch {
          setError("Failed to resend code.");
      } finally {
          setResendLoading(false);
      }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin"/></div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--db-bg)] px-4">
      <div className="w-full max-w-md bg-[var(--db-surface)] border-4 border-[var(--db-border)] shadow-[12px_12px_0px_0px_var(--db-border)] p-8">
        
        <div className="flex items-center gap-4 mb-8 border-b-4 border-[var(--db-border)] pb-4">
          <DeauBitLogo size={48} />
          <div>
            <h1 className="text-2xl font-black uppercase text-[var(--db-text)]">SYSTEM SETUP</h1>
            <p className="text-xs font-bold text-[var(--db-text-muted)]">Initialization Protocol</p>
          </div>
        </div>

        {step === "form" ? (
            <form onSubmit={handleSetup} className="space-y-4">
                <div className="bg-[var(--db-accent)] p-4 border-2 border-[var(--db-border)] mb-6 flex items-start gap-3">
                    <Server className="h-6 w-6 text-[var(--db-accent-fg)] shrink-0" />
                    <p className="text-xs font-bold text-[var(--db-accent-fg)] leading-tight">
                        No Administrator detected. Create root account to initialize.
                    </p>
                </div>
                <div>
                    <label className="font-black text-xs uppercase mb-1 block text-[var(--db-text)]">Admin Name</label>
                    <input className="w-full bg-[var(--db-bg)] border-2 border-[var(--db-border)] p-3 font-bold text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_var(--db-border)] transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div>
                    <label className="font-black text-xs uppercase mb-1 block text-[var(--db-text)]">Admin Email</label>
                    <input type="email" className="w-full bg-[var(--db-bg)] border-2 border-[var(--db-border)] p-3 font-bold text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_var(--db-border)] transition-all" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                </div>
                <div>
                    <label className="font-black text-xs uppercase mb-1 block text-[var(--db-text)]">Secure Password</label>
                    <input type="password" className="w-full bg-[var(--db-bg)] border-2 border-[var(--db-border)] p-3 font-bold text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_var(--db-border)] transition-all" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required minLength={8} />
                </div>
                {error && <div className="bg-[var(--db-danger)] text-white p-2 font-bold text-xs border-2 border-[var(--db-border)]">{error}</div>}
                <button type="submit" disabled={submitting} className="w-full bg-[var(--db-text)] text-[var(--db-bg)] py-4 font-black uppercase border-2 border-[var(--db-border)] hover:shadow-[4px_4px_0px_0px_var(--db-border)] hover:-translate-y-1 transition-all flex justify-center gap-2 mt-4">
                    {submitting ? <Loader2 className="animate-spin"/> : "NEXT: VERIFY EMAIL"}
                </button>
            </form>
        ) : (
            <form onSubmit={handleVerify} className="space-y-6 text-center">
                <div className="inline-block p-4 bg-yellow-400 border-4 border-[var(--db-border)] rounded-full mb-2 shadow-[4px_4px_0px_0px_var(--db-border)]">
                    <KeyRound className="h-8 w-8 text-black" />
                </div>
                <h2 className="text-xl font-black uppercase text-[var(--db-text)]">VERIFY ROOT ACCESS</h2>
                <p className="text-sm font-bold text-[var(--db-text-muted)]">Enter the OTP sent to {formData.email}</p>
                
                <input 
                    className="w-full text-center text-3xl font-mono font-bold tracking-[0.5em] py-4 bg-[var(--db-bg)] border-4 border-[var(--db-border)] focus:outline-none focus:shadow-[4px_4px_0px_0px_var(--db-border)] transition-all text-[var(--db-text)]" 
                    placeholder="000000" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} autoFocus 
                />
                
                {error && <div className="bg-[var(--db-danger)] text-white p-2 font-bold text-xs border-2 border-[var(--db-border)]">{error}</div>}
                
                <button type="submit" disabled={submitting || otp.length < 6} className="w-full bg-[var(--db-primary)] text-[var(--db-primary-fg)] py-4 font-black uppercase border-2 border-[var(--db-border)] hover:shadow-[4px_4px_0px_0px_var(--db-border)] hover:-translate-y-1 transition-all flex justify-center shadow-[4px_4px_0px_0px_var(--db-border)]">
                    {submitting ? <Loader2 className="animate-spin"/> : "CONFIRM & LAUNCH"}
                </button>

                <button 
                    type="button" 
                    onClick={handleResend} 
                    disabled={resendCooldown > 0 || resendLoading}
                    className="text-xs font-bold text-[var(--db-text-muted)] hover:text-[var(--db-primary)] flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                >
                    {resendLoading ? <Loader2 className="h-3 w-3 animate-spin"/> : <RefreshCw className={`h-3 w-3 ${resendCooldown === 0 ? "hover:rotate-180 transition-transform" : ""}`}/>}
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
                </button>
            </form>
        )}
      </div>
    </div>
  );
}
