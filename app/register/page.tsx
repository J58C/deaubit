//app/register/page.tsx

import DeauBitLogo from "@/components/DeauBitLogo";
import RegisterForm from "@/components/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="db-shell w-full max-w-md mx-auto p-6 db-animate-login">
      <div className="flex flex-col items-center gap-4 mb-6">
        <DeauBitLogo size={48} />
        <div className="text-center">
          <h1 className="text-lg font-bold tracking-tight">DeauBit Public</h1>
          <p className="text-xs db-muted">Platform shortlink mandiri & aman.</p>
        </div>
      </div>

      <RegisterForm />

      <div className="mt-6 text-center text-xs">
        <span className="db-muted">Sudah punya akun? </span>
        <Link href="/" className="font-semibold text-[var(--db-accent)] hover:underline">
          Login di sini
        </Link>
      </div>
    </div>
  );
}