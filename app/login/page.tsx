// app/login/page.tsx

"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Link2,
  ShieldCheck,
  KeyRound,
  Loader2,
  User2,
  Eye,
  EyeOff,
} from "lucide-react";
import DeauBitLogo from "@/components/DeauBitLogo";

function LoginContent() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [cooldown, setCooldown] = useState<number | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/";

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        const res = await fetch("/api/session", {
          method: "GET",
          credentials: "include",
        });
        
        const data = await res.json();

        if (!cancelled && data.authenticated) {
          router.replace(nextPath);
          return;
        }
      } catch {
      } finally {
        if (!cancelled) {
          setCheckingSession(false);
        }
      }
    }

    checkSession();

    return () => {
      cancelled = true;
    };
  }, [router, nextPath]);

  useEffect(() => {
    if (cooldown === null) return;
    if (cooldown <= 0) {
      setCooldown(null);
      return;
    }

    const id = setInterval(() => {
      setCooldown((prev) => {
        if (prev === null) return null;
        if (prev <= 1) return null;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [cooldown]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (cooldown !== null && cooldown > 0) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      type LoginResponse = {
        retryAfter?: number;
        error?: string;
        [key: string]: unknown;
      };

      const data: LoginResponse = await res.json().catch(() => ({}));

      if (res.status === 429) {
        const retry =
          typeof data.retryAfter === "number"
            ? data.retryAfter
            : 60;
        setCooldown(retry);
        setError(
          `Terlalu banyak percobaan login. Coba lagi dalam ${retry} detik.`
        );
        return;
      }

      if (!res.ok) {
        throw new Error((typeof data.error === "string" ? data.error : "Login gagal"));
      }

      router.push(nextPath);
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login gagal";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[var(--db-bg)]">
        <div className="rounded-3xl border border-[var(--db-border)] bg-[var(--db-surface)] px-8 py-6 shadow-lg flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 mb-1">
            <DeauBitLogo size={32} />
            <span className="text-sm font-semibold tracking-tight">
              DeauBit
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--db-text-muted)]">
            <Loader2 className="h-7 w-7 animate-spin" />
            <span>Memeriksa sesi</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]">
        <section className="flex flex-col justify-between gap-6">
          <div className="space-y-6 pl-4 md:pl-6 pt-1">
            <div className="flex items-center gap-3">
              <DeauBitLogo size={40} />
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight">
                  DeauBit
                </span>
                <span className="text-[var(--db-text-muted)] text-xs">
                  Elegant URL shortener for your own VPS.
                </span>
              </div>
            </div>

            <p className="text-sm text-[var(--db-text-muted)] max-w-md">
              Dashboard DeauBit membantu tim mengelola shortlink internal dan
              privat dengan tampilan ringkas dan fokus. Seluruh layanan
              dijalankan di server yang Anda kelola, tanpa ketergantungan pada
              platform lain.
            </p>

            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="bg-[var(--db-surface)] border border-[var(--db-border)] px-4 py-3 space-y-1 flex flex-col justify-between">
                <div className="inline-flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--db-accent)] text-[var(--db-accent-fg)]">
                    <Link2 className="h-3 w-3" />
                  </span>
                  <span className="font-semibold text-[0.7rem]">
                    Shortlink rapi
                  </span>
                </div>
                <p className="text-[var(--db-text-muted)]">
                  Slug pendek dan rapi untuk link penting. Mudah diingat oleh
                  seluruh anggota tim.
                </p>
              </div>

              <div className="bg-[var(--db-surface)] border border-[var(--db-border)] px-4 py-3 space-y-1 flex flex-col justify-between">
                <div className="inline-flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--db-accent)] text-[var(--db-accent-fg)]">
                    <ShieldCheck className="h-3 w-3" />
                  </span>
                  <span className="font-semibold text-[0.7rem]">
                    Akses terkontrol
                  </span>
                </div>
                <p className="text-[var(--db-text-muted)]">
                  Hanya akun berotorisasi yang dapat mengelola shortlink.
                  Pengaturan akses tetap berada di lingkungan Anda.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-4 md:px-6 pb-1">
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--db-border)] bg-[var(--db-surface)] px-3 py-1 text-[0.65rem]">
              <Link2 className="h-3 w-3" />
              <span className="font-medium">DeauBit</span>
            </span>
            <span className="text-[0.7rem] text-[var(--db-text-muted)]">
              Powered by{" "}
              <span
                className="font-semibold"
                style={{ color: "var(--db-accent)" }}
              >
                deauport
              </span>
            </span>
          </div>
        </section>

        <section className="flex items-center mt-4 md:mt-0">
          <div className="bg-[var(--db-surface)] border-4 border-[var(--db-border)] shadow-[8px_8px_0px_0px_var(--db-border)] w-full px-5 py-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--db-accent)] text-[var(--db-accent-fg)]"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-semibold">Admin login</span>
              </div>

              <div className="inline-flex items-center gap-1 text-[10px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full border border-green-200">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                JWT secured
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="flex items-center gap-1 text-xs font-medium mb-1">
                  <User2 className="h-3 w-3" />
                  Username
                </label>
                <input
                  className="w-full bg-[var(--db-bg)] border-2 border-[var(--db-border)] px-3 py-2 text-sm font-bold focus:outline-none focus:shadow-[2px_2px_0px_0px_var(--db-border)] transition-all"
                  placeholder="admin"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-1 text-xs font-medium mb-1">
                  <KeyRound className="h-3 w-3" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-[var(--db-bg)] border-2 border-[var(--db-border)] px-3 py-2 text-sm font-bold pr-9 focus:outline-none focus:shadow-[2px_2px_0px_0px_var(--db-border)] transition-all"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--db-text-muted)] hover:text-[var(--db-text)] transition-colors"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="min-h-[2.3rem] mt-1">
                {error && (
                  <p
                    className="text-[0.7rem] font-bold rounded border-2 px-3 py-2 border-red-200 bg-red-50 text-red-600"
                  >
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || (cooldown !== null && cooldown > 0)}
                className={`w-full bg-[var(--db-primary)] text-[var(--db-primary-fg)] border-2 border-[var(--db-border)] py-3 font-black text-sm uppercase tracking-widest shadow-[4px_4px_0px_0px_var(--db-border)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--db-border)] active:translate-y-0 active:shadow-none transition-all
                  ${
                    loading || (cooldown !== null && cooldown > 0)
                      ? "cursor-not-allowed opacity-80"
                      : ""
                  }`}
              >
                {loading && <Loader2 className="h-3.5 w-3.5 animate-spin mr-2 inline" />}
                <span>
                  {loading
                    ? "Memeriksa kredensial…"
                    : cooldown !== null && cooldown > 0
                    ? `Tunggu ${cooldown} detik`
                    : "Masuk ke dashboard"}
                </span>
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense 
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-[var(--db-bg)]">
          <Loader2 className="h-10 w-10 animate-spin text-[var(--db-text-muted)]" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
