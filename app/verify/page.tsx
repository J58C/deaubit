//app/verify/page.tsx

import DeauBitLogo from "@/components/DeauBitLogo";
import VerifyForm from "@/components/VerifyForm";
import Link from "next/link";

export default function VerifyPage() {
  return (
    <div className="db-shell w-full max-w-md mx-auto p-6 db-animate-login">
      <div className="flex flex-col items-center gap-4 mb-6">
        <DeauBitLogo size={40} />
      </div>

      <VerifyForm />

      <div className="mt-6 text-center text-xs">
        <Link href="/register" className="db-muted hover:text-[var(--db-text)] transition-colors">
          &larr; Kembali ke registrasi
        </Link>
      </div>
    </div>
  );
}