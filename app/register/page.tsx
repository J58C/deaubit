//app/register/page.tsx

import DeauBitLogo from "@/components/DeauBitLogo";
import RegisterForm from "@/components/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-8">
        
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-[var(--db-surface)] border-4 border-[var(--db-border)] shadow-[6px_6px_0px_0px_var(--db-border)]">
            <DeauBitLogo size={50} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-[var(--db-text)]">Join DeauBit</h1>
            <p className="text-[var(--db-text-muted)] font-bold">Start shortening links like a pro.</p>
          </div>
        </div>

        <RegisterForm />

        <div className="text-center">
          <span className="font-bold text-[var(--db-text-muted)]">Already have an account? </span>
          <Link href="/" className="font-black text-[var(--db-primary)] hover:bg-[var(--db-primary)] hover:text-[var(--db-primary-fg)] px-1 border-2 border-transparent hover:border-[var(--db-border)] transition-all uppercase">
            Login Here
          </Link>
        </div>

      </div>
    </div>
  );
}
