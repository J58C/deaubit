//components/RegisterForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, User2, Mail, KeyRound, FileSignature, Check } from "lucide-react";

export default function RegisterForm() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [confirmPassword, setConfirmPassword] = useState(""); // State baru
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== confirmPassword) {
      setError("Password tidak cocok.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
        setError("Password minimal 6 karakter.");
        setLoading(false);
        return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Registrasi gagal");

      router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[var(--db-surface)] border-4 border-[var(--db-border)] p-8 shadow-[8px_8px_0px_0px_var(--db-border)]">
      <div className="flex items-center gap-4 mb-8 border-b-4 border-[var(--db-border)] pb-4">
         <div className="bg-[var(--db-accent)] p-3 border-2 border-[var(--db-border)]">
            <FileSignature className="h-6 w-6 text-[var(--db-accent-fg)]"/>
         </div>
         <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-[var(--db-text)]">REGISTER</h2>
            <p className="text-xs font-bold text-[var(--db-text-muted)] uppercase">Join the Club</p>
         </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        <div>
            <label className="font-black text-xs uppercase mb-1 block text-[var(--db-text)]">Name</label>
            <div className="relative">
                <input 
                    type="text" 
                    className="w-full bg-[var(--db-bg)] border-2 border-[var(--db-border)] px-4 py-3 text-sm font-bold text-[var(--db-text)] focus:outline-none focus:shadow-[4px_4px_0px_0px_var(--db-border)] transition-all placeholder:font-normal placeholder:text-[var(--db-text-muted)]" 
                    placeholder="Your Name"
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    required 
                />
                <User2 className="absolute right-4 top-3 text-[var(--db-text-muted)] w-5 h-5" />
            </div>
        </div>

        <div>
            <label className="font-black text-xs uppercase mb-1 block text-[var(--db-text)]">Email</label>
            <div className="relative">
                <input 
                    type="email" 
                    className="w-full bg-[var(--db-bg)] border-2 border-[var(--db-border)] px-4 py-3 text-sm font-bold text-[var(--db-text)] focus:outline-none focus:shadow-[4px_4px_0px_0px_var(--db-border)] transition-all placeholder:font-normal placeholder:text-[var(--db-text-muted)]" 
                    placeholder="name@example.com"
                    value={formData.email} 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                    required 
                />
                <Mail className="absolute right-4 top-3 text-[var(--db-text-muted)] w-5 h-5" />
            </div>
        </div>

        <div>
            <label className="font-black text-xs uppercase mb-1 block text-[var(--db-text)]">Password</label>
            <div className="relative">
                <input 
                    type="password" 
                    className="w-full bg-[var(--db-bg)] border-2 border-[var(--db-border)] px-4 py-3 text-sm font-bold text-[var(--db-text)] focus:outline-none focus:shadow-[4px_4px_0px_0px_var(--db-border)] transition-all placeholder:font-normal placeholder:text-[var(--db-text-muted)]" 
                    placeholder="••••••••"
                    value={formData.password} 
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                    required 
                />
                <KeyRound className="absolute right-4 top-3 text-[var(--db-text-muted)] w-5 h-5" />
            </div>
        </div>

        <div>
            <label className="font-black text-xs uppercase mb-1 block text-[var(--db-text)]">Re-enter Password</label>
            <div className="relative">
                <input 
                    type="password" 
                    className={`w-full bg-[var(--db-bg)] border-2 border-[var(--db-border)] px-4 py-3 text-sm font-bold text-[var(--db-text)] focus:outline-none focus:shadow-[4px_4px_0px_0px_var(--db-border)] transition-all placeholder:font-normal placeholder:text-[var(--db-text-muted)] ${
                        confirmPassword && formData.password !== confirmPassword ? "border-red-500" : ""
                    }`}
                    placeholder="••••••••"
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                />
                {confirmPassword && formData.password === confirmPassword && (
                    <Check className="absolute right-4 top-3 text-green-500 w-5 h-5" />
                )}
            </div>
        </div>

        {error && (
            <div className="bg-[var(--db-danger)] text-white text-xs font-bold p-3 border-2 border-[var(--db-border)] shadow-[4px_4px_0px_0px_var(--db-border)] flex items-center gap-2">
                <span>❌</span> {error}
            </div>
        )}

        <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-[var(--db-text)] text-[var(--db-bg)] border-2 border-[var(--db-border)] py-4 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_var(--db-border)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--db-border)] active:translate-y-0 transition-all disabled:opacity-50"
        >
            {loading ? <Loader2 className="animate-spin mx-auto"/> : "CREATE ACCOUNT"}
        </button>
      </form>
    </div>
  );
}
