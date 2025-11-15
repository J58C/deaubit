"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Link2, ShieldCheck, KeyRound, User2, Shield, Eye, EyeOff } from "lucide-react";
import DeauBitLogo from "@/components/DeauBitLogo";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      router.push(nextPath);
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login gagal";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full db-animate-login">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]">
        {/* PANEL KIRI */}
        <section className="flex flex-col justify-center gap-6">
          <div className="space-y-6 pt-1">
            <div className="flex items-center gap-3">
              <DeauBitLogo size={40} />
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight">
                  DeauBit
                </span>
                <span className="db-muted">
                  Elegant URL shortener for your own VPS.
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm db-muted max-w-md">
                Dashboard DeauBit membantu tim mengelola shortlink internal dan
                privat dengan tampilan ringkas dan fokus. Seluruh layanan
                dijalankan di server yang Anda kelola, tanpa ketergantungan
                pada platform lain.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="db-card px-3 py-3 pb-4 space-y-1">
                <div className="inline-flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--db-accent-soft)] text-[var(--db-accent)]">
                    <Link2 className="h-3 w-3" />
                  </span>
                  <span className="font-semibold text-[0.7rem]">
                    Shortlink rapi
                  </span>
                </div>
                <p className="db-muted">
                  Slug pendek dan rapi untuk link penting. Mudah diingat oleh
                  seluruh anggota tim.
                </p>
              </div>

              <div className="db-card px-3 py-3 pb-4 space-y-1">
                <div className="inline-flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--db-accent-soft)] text-[var(--db-accent)]">
                    <Shield className="h-3 w-3" />
                  </span>
                  <span className="font-semibold text-[0.7rem]">
                    Akses terkontrol
                  </span>
                </div>
                <p className="db-muted">
                  Hanya akun berotorisasi yang dapat mengelola shortlink.
                  Pengaturan akses tetap berada di lingkungan Anda.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-start text-[0.7rem] db-muted mt-1">
            <span className="inline-flex items-center gap-1">
              <Link2 className="h-3 w-3" />
              DeauBit
            </span>
          </div>
        </section>

        {/* PANEL KANAN (FORM LOGIN) */}
        <section className="flex items-center mt-4 md:mt-0">
          <div className="db-card w-full px-5 py-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: "var(--db-accent-soft)",
                    color: "var(--db-accent)",
                  }}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-semibold">Admin login</span>
              </div>

              <div className="db-badge inline-flex items-center gap-1">
                <span className="db-status-dot" />
                JWT secured
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="flex items-center gap-1 text-xs font-medium">
                  <User2 className="h-3 w-3" />
                  Username
                </label>
                <input
                  className="db-input mt-1 w-full"
                  placeholder="User"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-1 text-xs font-medium">
                  <KeyRound className="h-3 w-3" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="db-input mt-1 w-full pr-10"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--db-muted)] hover:text-[var(--db-text)] transition"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* space khusus error → tidak mengubah tinggi card saat muncul */}
              <div className="min-h-[2.3rem] mt-1">
                {error && (
                  <p
                    className="text-[0.7rem] rounded-lg border px-3 py-2"
                    style={{
                      borderColor: "rgba(248, 113, 113, 0.5)",
                      backgroundColor: "var(--db-danger-soft)",
                    }}
                  >
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="db-btn-primary inline-flex items-center justify-center gap-2 w-full mt-1"
              >
                {loading ? "Memeriksa kredensial…" : "Masuk ke dashboard"}
              </button>

              <p className="text-center text-[0.65rem] db-muted pt-1">
                Powered by <span className="font-semibold">deauport</span>
              </p>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
