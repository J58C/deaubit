"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Link2,
  ShieldCheck,
  KeyRound,
  Loader2,
  User2,
  Eye,
  EyeOff,
  Copy,
  X,
} from "lucide-react";
import DeauBitLogo from "@/components/DeauBitLogo";

type PublicResult = {
  slug: string;
  shortUrl: string;
};

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [cooldown, setCooldown] = useState<number | null>(null);

  const [publicTarget, setPublicTarget] = useState("");
  const [publicLoading, setPublicLoading] = useState(false);
  const [publicError, setPublicError] = useState<string | null>(null);
  const [publicResult, setPublicResult] = useState<PublicResult | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dash";

  const publicBaseUrl =
    (process.env.NEXT_PUBLIC_BASE_URL ?? "").replace(/\/+$/, "") ||
    (typeof window !== "undefined"
      ? window.location.origin.replace(/\/+$/, "")
      : "");

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        const res = await fetch("/api/session", {
          method: "GET",
          credentials: "include",
        });

        if (!cancelled && res.ok) {
          router.replace(nextPath);
          return;
        }
      } catch {
      } finally {
        if (!cancelled) setCheckingSession(false);
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

    if (cooldown !== null && cooldown > 0) return;

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
          typeof data.retryAfter === "number" ? data.retryAfter : 60;
        setCooldown(retry);
        setError(
          `Terlalu banyak percobaan login. Coba lagi dalam ${retry} detik.`
        );
        return;
      }

      if (!res.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : "Login gagal"
        );
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

  async function handlePublicSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPublicLoading(true);
    setPublicError(null);
    setPublicResult(null);

    try {
      const res = await fetch("/api/public-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUrl: publicTarget }),
      });

      const data = await res.json().catch(() => ({} as any));

      if (!res.ok) {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : "Gagal membuat shortlink."
        );
      }

      const slug: string = data.slug;
      const shortUrl = publicBaseUrl
        ? `${publicBaseUrl}/${slug}`
        : `/${slug}`;

      setPublicResult({ slug, shortUrl });
      setPublicTarget("");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Gagal membuat shortlink.";
      setPublicError(msg);
    } finally {
      setPublicLoading(false);
    }
  }

  async function copyPublicShortUrl() {
    if (!publicResult?.shortUrl) return;
    try {
      await navigator.clipboard.writeText(publicResult.shortUrl);
    } catch {
      alert("Gagal menyalin ke clipboard");
    }
  }

  if (checkingSession) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-(--db-bg)">
        <div className="rounded-3xl border border-(--db-border-soft) bg-(--db-surface) px-8 py-6 shadow-lg flex flex-col items-center gap-3 db-animate-login">
          <div className="flex items-center gap-2 mb-1">
            <DeauBitLogo size={32} />
            <span className="text-sm font-semibold tracking-tight">
              DeauBit
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs db-muted">
            <Loader2 className="h-7 w-7 animate-spin" />
            <span>Memeriksa sesi</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="db-shell w-full max-w-3xl mx-auto px-4 py-6 md:px-6 md:py-8 db-animate-login">
      <div className="grid grid-cols-1 gap-6 md:gap-7 md:grid-cols-2 items-start">
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <DeauBitLogo size={40} />
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">
                DeauBit
              </span>
              <span className="db-muted text-xs">
                Elegant URL shortener for your own VPS.
              </span>
            </div>
          </div>

          <div className="db-card db-card-pop px-4 py-4 md:px-5 md:py-5">
            <div className="w-full max-w-sm">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-(--db-accent-soft) text-(--db-accent)">
                  <Link2 className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs font-semibold">
                  Create new shortlink
                </span>
              </div>

              <p className="db-muted text-[0.75rem] mb-4">
                Tambah shortlink publik tanpa login. Slug akan dibuat acak
                secara otomatis.
              </p>

              <form className="space-y-3" onSubmit={handlePublicSubmit}>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium">
                    Target URL
                  </label>
                  <input
                    className="db-input w-full"
                    placeholder="https://example.com"
                    value={publicTarget}
                    onChange={(e) => setPublicTarget(e.target.value)}
                    required
                  />
                  <p className="db-muted text-[0.7rem]">
                    Sertakan{" "}
                    <code className="font-mono">https://</code> atau{" "}
                    <code className="font-mono">http://</code>.
                  </p>
                </div>

                {publicError && (
                  <p
                    className="text-[0.7rem] rounded-lg border px-3 py-2"
                    style={{
                      borderColor: "rgba(248, 113, 113, 0.5)",
                      backgroundColor: "var(--db-danger-soft)",
                    }}
                  >
                    {publicError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={publicLoading}
                  className={`db-btn-primary inline-flex items-center justify-center gap-2 w-full rounded-full
                    transition-all duration-200 transform
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--db-accent)
                    focus-visible:ring-offset-2 focus-visible:ring-offset-(--db-bg)
                    ${
                      publicLoading
                        ? "cursor-not-allowed opacity-80"
                        : "hover:-translate-y-px hover:shadow-[0_0_22px_rgba(59,130,246,0.45)] active:translate-y-px active:scale-[0.97]"
                    }`}
                >
                  {publicLoading && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  <span>
                    {publicLoading ? "Membuat shortlink…" : "Buat shortlink"}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="flex items-stretch mt-1 md:mt-0">
          <div className="db-card w-full px-5 py-5 flex flex-col">
            <div className="flex items-center justify-between gap-3 mb-3">
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

          <div className="w-full max-w-sm mx-auto flex-1 flex flex-col">
            <form
              onSubmit={handleSubmit}
              className="flex-1 flex flex-col gap-3"
            >
              <div>
                <label className="flex items-center gap-1 text-xs font-medium">
                  <User2 className="h-3 w-3" />
                  Username
                </label>
                <input
                  className="db-input mt-1 w-full"
                  placeholder="admin"
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
                    className="db-input mt-1 w-full pr-9"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-(--db-muted) hover:text-(--db-text) transition-colors"
                    aria-label={
                      showPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
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

              <div className="pt-1 flex justify-center">
                <button
                  type="submit"
                  disabled={loading || (cooldown !== null && cooldown > 0)}
                  className={`db-btn-primary inline-flex items-center justify-center gap-2 rounded-full
                    w-full md:w-auto px-6
                    transition-all duration-200 transform
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--db-accent)
                    focus-visible:ring-offset-2 focus-visible:ring-offset-(--db-bg)
                    ${
                      loading || (cooldown !== null && cooldown > 0)
                        ? "cursor-not-allowed opacity-80"
                        : "hover:-translate-y-px hover:shadow-[0_0_22px_rgba(59,130,246,0.45)] active:translate-y-px active:scale-[0.97]"
                    }`}
                >
                  {loading && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  <span>
                    {loading
                      ? "Memeriksa kredensial…"
                      : cooldown !== null && cooldown > 0
                      ? `Tunggu ${cooldown} detik`
                      : "Masuk ke dashboard"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>

    {publicResult && (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setPublicResult(null)}
        />
        <div className="relative w-full max-w-md db-card db-card-pop p-5 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex flex-col">
              <span className="text-xs font-semibold">
                Shortlink berhasil dibuat
              </span>
              <span className="db-muted text-[0.7rem]">
                Salin atau buka link di tab baru.
              </span>
            </div>
            <button
              type="button"
              className="db-btn-icon"
              onClick={() => setPublicResult(null)}
              aria-label="Tutup"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="rounded-lg border border-(--db-border-soft) bg-(--db-surface-muted) px-3 py-2 text-left">
            <p className="font-mono text-[0.7rem] break-all">
              {publicResult.shortUrl}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
            <button
              type="button"
              className="db-btn-ghost inline-flex items-center gap-1 text-[0.7rem]"
              onClick={copyPublicShortUrl}
            >
              <Copy className="h-3 w-3" />
              Copy
            </button>
            <a
              href={publicResult.shortUrl}
              target="_blank"
              rel="noreferrer"
              className="db-btn-primary inline-flex items-center gap-1 text-[0.7rem]"
            >
              Buka link
            </a>
          </div>
        </div>
      </div>
    )}

    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[0.7rem]">
      <span className="inline-flex items-center gap-1 rounded-full border border-(--db-border-soft) bg-(--db-surface-muted) px-3 py-1">
        <Link2 className="h-3 w-3" />
        <span className="font-medium">DeauBit</span>
      </span>
      <span className="db-muted">
        Powered by{" "}
        <span
          className="font-semibold"
          style={{ color: "var(--db-accent)" }}
        >
          deauport
        </span>
      </span>
    </div>
  </div>
  );
}
