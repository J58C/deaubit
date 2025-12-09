//app/not-found.tsx

"use client";

import Link from "next/link";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";
import DeauBitLogo from "@/components/DeauBitLogo";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--db-bg)] text-center">
      
      <div className="max-w-md w-full bg-[var(--db-surface)] border-4 border-[var(--db-border)] p-8 shadow-[12px_12px_0px_0px_var(--db-border)] flex flex-col items-center">
        
        <div className="relative mb-6">
            <div className="absolute inset-0 bg-[var(--db-danger)] translate-x-2 translate-y-2 border-2 border-[var(--db-border)]"></div>
            <div className="relative bg-[var(--db-surface)] border-2 border-[var(--db-border)] p-4">
                <FileQuestion className="h-12 w-12 text-[var(--db-text)]" />
            </div>
        </div>

        <h1 className="text-6xl font-black text-[var(--db-text)] mb-2 tracking-tighter">404</h1>
        <h2 className="text-xl font-black uppercase text-[var(--db-text)] mb-4 bg-[var(--db-accent)] px-2">
            LINK NOT FOUND
        </h2>
        
        <p className="text-sm font-bold text-[var(--db-text-muted)] mb-8 max-w-[80%]">
            The link you are looking for might have been deleted, expired, or never existed in this dimension.
        </p>

        <div className="flex flex-col gap-3 w-full">
            <Link 
                href="/" 
                className="w-full py-4 bg-[var(--db-text)] text-[var(--db-bg)] font-black uppercase border-2 border-[var(--db-border)] hover:shadow-[4px_4px_0px_0px_var(--db-border)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
                <Home className="h-4 w-4" /> Return Home
            </Link>
            
            <button 
                onClick={() => window.history.back()}
                className="w-full py-4 bg-[var(--db-bg)] text-[var(--db-text)] font-black uppercase border-2 border-[var(--db-border)] hover:bg-[var(--db-surface)] transition-all flex items-center justify-center gap-2"
            >
                <ArrowLeft className="h-4 w-4" /> Go Back
            </button>
        </div>

      </div>

      <div className="mt-8 opacity-50 grayscale hover:grayscale-0 transition-all">
         <DeauBitLogo size={30} />
      </div>
    </div>
  );
}
