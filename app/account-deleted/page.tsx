// app/account-deleted/page.tsx

"use client";

import DeauBitLogo from "@/components/DeauBitLogo";
import Link from "next/link";
import { UserX, ArrowRight } from "lucide-react";

export default function AccountDeletedPage() {
  return (
    <div className="w-full max-w-md bg-[var(--db-surface)] border-4 border-[var(--db-border)] p-8 shadow-[12px_12px_0px_0px_var(--db-border)] text-center animate-in zoom-in-95 duration-300">
      
      <div className="flex justify-center mb-6">
        <DeauBitLogo size={60} />
      </div>

      <div className="inline-block p-4 bg-[var(--db-text)] border-4 border-[var(--db-border)] rounded-full mb-6 shadow-[4px_4px_0px_0px_var(--db-border)] text-[var(--db-bg)]">
         <UserX className="h-10 w-10" />
      </div>

      <h1 className="text-3xl font-black uppercase text-[var(--db-text)] mb-2">ACCOUNT DELETED</h1>
      <p className="text-sm font-bold text-[var(--db-text-muted)] mb-8 leading-relaxed">
        We're sorry to see you go. Your account and all associated data have been permanently removed from our servers.
      </p>

      <div className="space-y-3">
        <Link 
            href="/"
            className="flex items-center justify-center gap-2 w-full bg-[var(--db-primary)] text-[var(--db-primary-fg)] py-4 font-black uppercase border-2 border-[var(--db-border)] hover:shadow-[6px_6px_0px_0px_var(--db-border)] hover:-translate-y-1 transition-all"
        >
            Back to Home <ArrowRight className="h-5 w-5" />
        </Link>
        
        <Link 
            href="/register"
            className="flex items-center justify-center gap-2 w-full bg-[var(--db-surface)] text-[var(--db-text)] py-3 font-bold uppercase border-2 border-transparent hover:border-[var(--db-border)] transition-all text-xs tracking-widest"
        >
            Create New Account
        </Link>
      </div>
    </div>
  );
}
