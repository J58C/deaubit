//components/LoginForm.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, KeyRound, Eye, EyeOff, ShieldCheck } from "lucide-react";
import type { LoginResponse } from "@/types";

interface LoginFormProps {
    nextPath?: string;
}

export default function LoginForm({ nextPath = "/dash" }: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState<number | null>(null);

    const router = useRouter();

    useEffect(() => {
        if (cooldown === null) return;
        if (cooldown <= 0) {
            setCooldown(null);
            return;
        }
        const id = setInterval(() => {
            setCooldown((prev) => (prev === null || prev <= 1 ? null : prev - 1));
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
                body: JSON.stringify({ email, password }),
            });

            const data: LoginResponse = await res.json().catch(() => ({}));

            if (res.status === 429) {
                const retry = typeof data.retryAfter === "number" ? data.retryAfter : 60;
                setCooldown(retry);
                setError(`Terlalu banyak percobaan. Tunggu ${retry} detik.`);
                return;
            }

            if (!res.ok) {
                throw new Error(typeof data.error === "string" ? data.error : "Login gagal");
            }

            window.location.href = nextPath;

        } catch (err) {
            const msg = err instanceof Error ? err.message : "Login gagal";
            setError(msg);
            setLoading(false);
        }
    }

    return (
        <section className="flex items-stretch mt-1 md:mt-0">
            <div className="db-card w-full px-5 py-5 flex flex-col">
                <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="inline-flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--db-accent-soft)] text-[var(--db-accent)]">
                            <ShieldCheck className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs font-semibold">User login</span>
                    </div>
                    <div className="db-badge inline-flex items-center gap-1">
                        <span className="db-status-dot" />
                        Secure
                    </div>
                </div>

                <div className="w-full max-w-sm mx-auto flex-1 flex flex-col">
                    <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-3">
                        <div>
                            <label className="flex items-center gap-1 text-xs font-medium">
                                <Mail className="h-3 w-3" />
                                Email
                            </label>
                            <input
                                type="email"
                                className="db-input mt-1 w-full"
                                placeholder="nama@email.com"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-1 text-xs font-medium">
                                    <KeyRound className="h-3 w-3" />
                                    Password
                                </label>
                                <Link 
                                    href="/forgot-password" 
                                    className="text-[0.65rem] db-muted hover:text-[var(--db-accent)] transition-colors"
                                    tabIndex={-1}
                                >
                                    Lupa password?
                                </Link>
                            </div>
                            
                            <div className="relative mt-1">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="db-input w-full pr-9"
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
                                    aria-label={showPassword ? "Sembunyikan" : "Tampilkan"}
                                >
                                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                </button>
                            </div>
                        </div>

                        <div className="min-h-[2.3rem] mt-1">
                            {error && (
                                <p className="text-[0.7rem] rounded-lg border border-red-200 bg-red-50 text-red-600 px-3 py-2 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
                                    {error}
                                </p>
                            )}
                        </div>

                        <div className="pt-1 flex justify-center">
                            <button
                                type="submit"
                                disabled={loading || (cooldown !== null && cooldown > 0)}
                                className={`db-btn-primary inline-flex items-center justify-center gap-2 rounded-full w-full md:w-auto px-6 transition-all duration-200 transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--db-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--db-bg)] ${
                                    loading || (cooldown !== null && cooldown > 0)
                                        ? "cursor-not-allowed opacity-80"
                                        : "hover:-translate-y-px hover:shadow-[0_0_22px_rgba(59,130,246,0.45)] active:translate-y-px active:scale-[0.97]"
                                }`}
                            >
                                {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                                <span>
                                    {loading
                                        ? "Memeriksa..."
                                        : cooldown !== null && cooldown > 0
                                        ? `Tunggu ${cooldown}s`
                                        : "Masuk dashboard"}
                                </span>
                            </button>
                        </div>
                    </form>

                    <div className="mt-4 text-center text-xs">
                        <span className="db-muted">Belum punya akun? </span>
                        <Link href="/register" className="font-semibold text-[var(--db-accent)] hover:underline">
                            Daftar sekarang
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
