//app/error.tsx

"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--db-bg)] p-4">
        <div className="max-w-md w-full bg-[var(--db-surface)] border-4 border-[var(--db-border)] p-8 shadow-[12px_12px_0px_0px_var(--db-danger)] text-center">
            
            <div className="flex justify-center mb-6">
                <div className="bg-red-600 text-white p-4 border-4 border-[var(--db-border)] rounded-full animate-pulse">
                    <AlertTriangle className="h-10 w-10" />
                </div>
            </div>

            <h2 className="text-2xl font-black uppercase text-[var(--db-text)] mb-2">SYSTEM CRITICAL</h2>
            <p className="text-sm font-bold text-[var(--db-text-muted)] mb-6">
                An unexpected error occurred within the core matrix.
            </p>

            <div className="bg-red-50 border-2 border-red-200 p-3 mb-6 text-left overflow-auto max-h-32">
                <code className="text-[10px] font-mono text-red-600 break-all">
                    {error.message || "Unknown Error"}
                </code>
            </div>

            <button
                onClick={() => reset()}
                className="w-full py-4 bg-[var(--db-text)] text-[var(--db-bg)] font-black uppercase border-2 border-[var(--db-border)] hover:shadow-[4px_4px_0px_0px_var(--db-border)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
                <RefreshCw className="h-4 w-4" /> REBOOT SYSTEM (RETRY)
            </button>
        </div>
    </div>
  );
}
