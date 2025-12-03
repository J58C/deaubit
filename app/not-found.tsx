//app/not-found.tsx

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--db-bg)] text-[var(--db-text)]">
      <div className="w-full max-w-md bg-[var(--db-surface)] border-4 border-[var(--db-border)] p-8 shadow-[12px_12px_0px_0px_var(--db-border)] text-center">
        <div className="inline-block p-4 bg-[var(--db-accent)] border-4 border-[var(--db-border)] rounded-full mb-6 shadow-[4px_4px_0px_0px_var(--db-border)]">
           <AlertTriangle className="h-12 w-12 text-[var(--db-accent-fg)]" />
        </div>
        
        <h1 className="text-6xl font-black mb-2">404</h1>
        <h2 className="text-2xl font-black uppercase mb-4">Page Not Found</h2>
        
        <p className="font-bold text-[var(--db-text-muted)] mb-8 border-t-2 border-b-2 border-[var(--db-border)] py-4">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <Link href="/" className="block w-full bg-[var(--db-text)] text-[var(--db-bg)] border-4 border-[var(--db-border)] py-4 font-black uppercase hover:shadow-[6px_6px_0px_0px_var(--db-border)] hover:-translate-y-1 transition-all">
          Back to Safety
        </Link>
      </div>
    </div>
  );
}