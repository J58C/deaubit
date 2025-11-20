//app/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Link2 } from "lucide-react";
import DeauBitLogo from "@/components/DeauBitLogo";
import LoginForm from "@/components/LoginForm";
import PublicShortlinkForm from "@/components/PublicShortlinkForm";

export default function LoginPage() {
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dash";

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        const res = await fetch("/api/session", {
          method: "GET",
          credentials: "include",
        });

        if (!cancelled && res.ok) {
          router.replace(nextPath);
          return;
        }
      } catch {
      } finally {
        if (!cancelled) setCheckingSession(false);
      }
    }

    checkSession();

    return () => {
      cancelled = true;
    };
  }, [router, nextPath]);

  if (checkingSession) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-(--db-bg)">
        <div className="rounded-3xl border border-(--db-border-soft) bg-(--db-surface) px-8 py-6 shadow-lg flex flex-col items-center gap-3 db-animate-login">
          <div className="flex items-center gap-2 mb-1">
            <DeauBitLogo size={32} />
            <span className="text-sm font-semibold tracking-tight">
              DeauBit
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs db-muted">
            <Loader2 className="h-7 w-7 animate-spin" />
            <span>Memeriksa sesi</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="db-shell w-full max-w-3xl mx-auto px-4 py-6 md:px-6 md:py-8 db-animate-login">
      <div className="grid grid-cols-1 gap-6 md:gap-7 md:grid-cols-2 items-start">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <DeauBitLogo size={40} />
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">
                DeauBit
              </span>
              <span className="db-muted text-xs">
                Elegant URL shortener for your own VPS.
              </span>
            </div>
          </div>

          <PublicShortlinkForm />
        </div>

        <LoginForm nextPath={nextPath} />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[0.7rem]">
        <span className="inline-flex items-center gap-1 rounded-full border border-(--db-border-soft) bg-(--db-surface-muted) px-3 py-1">
          <Link2 className="h-3 w-3" />
          <span className="font-medium">DeauBit</span>
        </span>
        <span className="db-muted">
          Powered by{" "}
          <span
            className="font-semibold"
            style={{ color: "var(--db-accent)" }}
          >
            deauport
          </span>
        </span>
      </div>
    </div>
  );
}
