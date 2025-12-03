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
    const [publicResult, setPublicResult] = useState<ShortlinkResult | null>(null);

    const publicBaseUrl = (process.env.NEXT_PUBLIC_BASE_URL ?? "").replace(/\/+$/, "") ||
        (typeof window !== "undefined" ? window.location.origin.replace(/\/+$/, "") : "");

    async function handlePublicSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setPublicLoading(true); setPublicError(null); setPublicResult(null);

        try {
            const res = await fetch("/api/public-links", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetUrl: publicTarget }),
            });
            const data: PublicLinkResponse = await res.json().catch(() => ({} as PublicLinkResponse));

            if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Gagal.");

            setPublicResult({ slug: data.slug, shortUrl: publicBaseUrl ? `${publicBaseUrl}/${data.slug}` : `/${data.slug}` });
            setPublicTarget("");
        } catch (err) {
            setPublicError(err instanceof Error ? err.message : "Gagal.");
        } finally {
            setPublicLoading(false);
        }
    }

    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2 border-b-4 border-[var(--db-border)] pb-2 text-[var(--db-text)]">
                    <Link2 className="h-6 w-6" />
                    <h3 className="text-xl font-black uppercase">Quick Shorten</h3>
                </div>
                
                <p className="text-sm font-medium text-[var(--db-text-muted)] mb-4">
                    Buat link instan tanpa login (Expired: 3 Hari).
                </p>

                <form className="space-y-4" onSubmit={handlePublicSubmit}>
                    <div className="space-y-1">
                        <label className="text-xs font-black uppercase bg-[var(--db-text)] text-[var(--db-bg)] px-2 py-0.5 inline-block">Target URL</label>
                        <input
                            className="w-full bg-[var(--db-bg)] border-2 border-[var(--db-border)] px-4 py-3 text-sm font-bold text-[var(--db-text)] focus:outline-none focus:shadow-[4px_4px_0px_0px_var(--db-border)] transition-all placeholder:font-normal placeholder:text-[var(--db-text-muted)]"
                            placeholder="https://..."
                            value={publicTarget}
                            onChange={(e) => setPublicTarget(e.target.value)}
                            required
                        />
                    </div>

                    {publicError && (
                        <div className="bg-red-100 border-2 border-[var(--db-border)] text-red-600 p-2 text-xs font-bold">
                            ERROR: {publicError}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={publicLoading}
                        className="w-full bg-[var(--db-text)] text-[var(--db-bg)] py-3 font-black text-sm uppercase border-2 border-[var(--db-border)] hover:bg-[var(--db-primary)] hover:text-white hover:shadow-[4px_4px_0px_0px_var(--db-border)] hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all disabled:opacity-50"
                    >
                        {publicLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto"/> : "SHORTEN NOW"}
                    </button>
                </form>
            </div>

            {publicResult && (
                <ShortlinkResultModal result={publicResult} onClose={() => setPublicResult(null)} />
            )}
        </>
    );
}
