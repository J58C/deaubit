//components/RegisterForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, User2, Mail, KeyRound, ArrowRight } from "lucide-react";

export default function RegisterForm() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
    <div className="db-card w-full px-5 py-5 flex flex-col">
      <div className="mb-4">
        <h2 className="text-sm font-bold">Buat Akun Baru</h2>
        <p className="text-xs db-muted">Isi data diri untuk memulai.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-col gap-3 flex">
        <div>
          <label className="text-xs font-medium flex items-center gap-1 mb-1">
            <User2 className="h-3 w-3" /> Nama
          </label>
          <input
            className="db-input w-full"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="text-xs font-medium flex items-center gap-1 mb-1">
            <Mail className="h-3 w-3" /> Email
          </label>
          <input
            type="email"
            className="db-input w-full"
            placeholder="nama@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="text-xs font-medium flex items-center gap-1 mb-1">
            <KeyRound className="h-3 w-3" /> Password
          </label>
          <input
            type="password"
            className="db-input w-full"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        {error && (
          <div className="p-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="db-btn-primary w-full flex justify-center items-center gap-2 mt-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Daftar Sekarang"}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>
    </div>
  );
}