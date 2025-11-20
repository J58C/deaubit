//components/ShortlinkResultModal.tsx

"use client";

import { Copy, X } from "lucide-react";
import type { ShortlinkResult } from "@/types";

interface ShortlinkResultModalProps {
    result: ShortlinkResult;
    onClose: () => void;
}

export default function ShortlinkResultModal({
    result,
    onClose,
}: ShortlinkResultModalProps) {
    async function copyShortUrl() {
        if (!result?.shortUrl) return;
        try {
            await navigator.clipboard.writeText(result.shortUrl);
        } catch {
            alert("Gagal menyalin ke clipboard");
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
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
                        onClick={onClose}
                        aria-label="Tutup"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>

                <div className="rounded-lg border border-(--db-border-soft) bg-(--db-surface-muted) px-3 py-2 text-left">
                    <p className="font-mono text-[0.7rem] break-all">
                        {result.shortUrl}
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                    <button
                        type="button"
                        className="db-btn-ghost inline-flex items-center gap-1 text-[0.7rem]"
                        onClick={copyShortUrl}
                    >
                        <Copy className="h-3 w-3" />
                        Copy
                    </button>
                    <a
                        href={result.shortUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="db-btn-primary inline-flex items-center gap-1 text-[0.7rem]"
                    >
                        Buka link
                    </a>
                </div>
            </div>
        </div>
    );
}
