//components/PublicShortlinkForm.tsx

"use client";

import { useState } from "react";
import { Loader2, Link2 } from "lucide-react";
import type { ShortlinkResult, PublicLinkResponse } from "@/types";
import ShortlinkResultModal from "./ShortlinkResultModal";
import Link from "next/link";

export default function PublicShortlinkForm() {
    const [publicTarget, setPublicTarget] = useState("");
    const [publicLoading, setPublicLoading] = useState(false);
    const [publicError, setPublicError] = useState<string | null>(null);
    const [publicResult, setPublicResult] = useState<ShortlinkResult | null>(null);
    
    const [agreed, setAgreed] = useState(false);

    const shortBaseUrl = 
        (process.env.NEXT_PUBLIC_SHORT_HOST || process.env.NEXT_PUBLIC_APP_HOST || "")
        .replace(/\/+$/, "") || 
        (typeof window !== "undefined" ? window.location.origin.replace(/\/+$/, "") : "");
    
    const protocol = process.env.NEXT_PUBLIC_PROTOCOL || "https";

    async function handlePublicSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        if (!agreed) {
            setPublicError("Please agree to the Terms & Privacy Policy.");
            return;
        }

        setPublicLoading(true); setPublicError(null); setPublicResult(null);

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

            const shortUrl = `${protocol}://${shortBaseUrl}/${data.slug}`;

            setPublicResult({ slug: data.slug, shortUrl });
            setPublicTarget("");
            setAgreed(false);
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
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2 border-b-4 border-[var(--db-border)] pb-2 text-[var(--db-text)]">
                    <Link2 className="h-6 w-6" />
                    <h3 className="text-xl font-black uppercase">Quick Shorten</h3>
                </div>
                
                <p className="text-sm font-medium text-[var(--db-text-muted)] mb-4">
                    Buat link instan tanpa login (Expired: 1 Hari).
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
                            autoComplete="off"
                        />
                    </div>

                    <div className="flex items-start gap-2">
                        <input 
                            type="checkbox" 
                            id="terms_agree" 
                            className="mt-1 w-4 h-4 accent-[var(--db-primary)] cursor-pointer"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                        />
                        <label htmlFor="terms_agree" className="text-xs font-bold text-[var(--db-text-muted)] cursor-pointer select-none">
                            I agree to the <Link href="/terms" target="_blank" className="underline hover:text-[var(--db-text)]">Terms of Service</Link> and <Link href="/privacy" target="_blank" className="underline hover:text-[var(--db-text)]">Privacy Policy</Link>.
                        </label>
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
                <ShortlinkResultModal
                    result={publicResult}
                    onClose={() => setPublicResult(null)}
                />
            )}
        </>
    );
}
