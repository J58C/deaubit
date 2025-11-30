//compnents/PasswordGuard.tsx

"use client";
import { useState } from "react";
import { Lock, Loader2 } from "lucide-react";
import SlugRedirector from "./SlugRedirector";

export default function PasswordGuard({ slug }: { slug: string }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [targetUrl, setTargetUrl] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/links/${slug}/verify`, {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Akses ditolak");
      
      setTargetUrl(data.targetUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal");
      setLoading(false);
    }
  }

  if (targetUrl) {
    return (
      <div className="text-center space-y-4">
        <div className="p-3 bg-green-100 text-green-700 rounded-full inline-block mx-auto mb-2">
           <Lock className="h-6 w-6" />
        </div>
        <h1 className="text-lg font-bold">Akses Diterima</h1>
        <SlugRedirector target={targetUrl} delay={2} />
        <p className="text-xs db-muted">Mengalihkan...</p>
      </div>
    );
  }

  return (
    <div className="w-full text-center space-y-4">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-(--db-surface-muted) border border-(--db-border)">
        <Lock className="h-5 w-5 db-muted" />
      </div>
      
      <div>
        <h1 className="text-lg font-bold">Link Terproteksi</h1>
        <p className="text-xs db-muted">Masukkan password untuk melanjutkan.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 pt-2">
        <input
          type="password"
          className="db-input w-full text-center"
          placeholder="Password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        
        {error && (
          <p className="text-xs text-red-500 font-medium">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="db-btn-primary w-full flex items-center justify-center gap-2 py-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buka Link"}
        </button>
      </form>
    </div>
  );
}
