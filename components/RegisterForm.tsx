//components/RegisterForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, User2, Mail, KeyRound, ArrowRight, FileSignature } from "lucide-react";

export default function RegisterForm() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
    } catch (err) { setError(err instanceof Error ? err.message : "Error"); } finally { setLoading(false); }
  }

  return (
    <div className="bg-[var(--db-surface)] border-4 border-[var(--db-border)] p-8 shadow-[8px_8px_0px_0px_var(--db-border)]">
      <div className="flex items-center gap-4 mb-8 border-b-4 border-[var(--db-border)] pb-4">
         <div className="bg-[var(--db-accent)] p-3 border-2 border-[var(--db-border)]"><FileSignature className="h-6 w-6 text-[var(--db-text)]"/></div>
         <div><h2 className="text-2xl font-black uppercase tracking-tighter text-[var(--db-text)]">REGISTER</h2><p className="text-xs font-bold text-[var(--db-text-muted)] uppercase">Join the Club</p></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {[
            { label: "Full Name", icon: <User2/>, type: "text", val: formData.name, key: "name" },
            { label: "Email", icon: <Mail/>, type: "email", val: formData.email, key: "email" },
            { label: "Password", icon: <KeyRound/>, type: "password", val: formData.password, key: "password" }
        ].map((field) => (
            <div key={field.key}>
                <label className="font-black text-xs uppercase mb-1 block text-[var(--db-text)]">{field.label}</label>
                <div className="relative">
                    <input type={field.type} className="w-full bg-[var(--db-bg)] border-2 border-[var(--db-border)] px-4 py-3 text-sm font-bold text-[var(--db-text)] focus:outline-none focus:shadow-[4px_4px_0px_0px_var(--db-border)] transition-all" 
                        value={field.val} onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })} required />
                    <div className="absolute right-4 top-3 text-[var(--db-text-muted)] w-5 h-5">{field.icon}</div>
                </div>
            </div>
        ))}

        {error && <div className="bg-[var(--db-danger)] text-white text-xs font-bold p-3 border-2 border-[var(--db-border)] shadow-[4px_4px_0px_0px_var(--db-border)]">❌ {error}</div>}

        <button type="submit" disabled={loading} className="w-full bg-[var(--db-text)] text-[var(--db-bg)] border-2 border-[var(--db-border)] py-4 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_var(--db-border)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--db-border)] active:translate-y-0 transition-all disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin mx-auto"/> : "CREATE ACCOUNT"}
        </button>
      </form>
    </div>
  );
}
