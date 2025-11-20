//components/PublicShortlinkForm.tsx

"use client";

import { useState } from "react";
import { Loader2, Link2 } from "lucide-react";
import type { ShortlinkResult, PublicLinkResponse } from "@/types";
import ShortlinkResultModal from "./ShortlinkResultModal";

export default function PublicShortlinkForm() {
    const [publicTarget, setPublicTarget] = useState("");
    const [publicLoading, setPublicLoading] = useState(false);
    const [publicError, setPublicError] = useState<string | null>(null);
    const [publicResult, setPublicResult] = useState<ShortlinkResult | null>(
        null
    );

    const publicBaseUrl =
        (process.env.NEXT_PUBLIC_BASE_URL ?? "").replace(/\/+$/, "") ||
        (typeof window !== "undefined"
            ? window.location.origin.replace(/\/+$/, "")
            : "");

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

            const data: PublicLinkResponse = await res.json().catch(() => ({} as PublicLinkResponse));

            if (!res.ok) {
                throw new Error(
                    typeof data.error === "string"
                        ? data.error
                        : "Gagal membuat shortlink."
                );
            }

            const slug = data.slug;
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

    return (
        <>
            <section className="flex flex-col gap-4">
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
                  ${publicLoading
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

            {publicResult && (
                <ShortlinkResultModal
                    result={publicResult}
                    onClose={() => setPublicResult(null)}
                />
            )}
        </>
    );
}
