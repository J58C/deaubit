//components/LoginForm.tsx

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, User2, KeyRound, Eye, EyeOff, ShieldCheck } from "lucide-react";
import type { LoginResponse } from "@/types";

interface LoginFormProps {
    nextPath?: string;
}

export default function LoginForm({ nextPath = "/dash" }: LoginFormProps) {
    const [username, setUsername] = useState("");
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

    return (
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
                  ${loading || (cooldown !== null && cooldown > 0)
                                        ? "cursor-not-allowed opacity-80"
                                        : "hover:-translate-y-px hover:shadow-[0_0_22px_rgba(59,130,246,0.45)] active:translate-y-px active:scale-[0.97]"
                                    }`}
                            >
                                {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
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
    );
}
