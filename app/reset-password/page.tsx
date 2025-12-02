// app/reset-password/page.tsx

"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DeauBitLogo from "@/components/DeauBitLogo";
import { Loader2, Lock } from "lucide-react";

function ResetContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setStatus("success");
      setTimeout(() => router.push("/"), 2000);
    } catch (err) {
      setStatus("error");
      setMsg(err instanceof Error ? err.message : "Gagal");
    } finally {
      setLoading(false);
    }
  }

  if (!token || !email) {
    return <div className="text-center text-sm text-red-500">Link tidak valid (Token hilang).</div>;
  }

  if (status === "success") {
    return (
      <div className="text-center p-6 bg-green-50 text-green-700 rounded-lg">
        <h3 className="font-bold">Sukses!</h3>
        <p className="text-sm mt-1">Password berhasil diubah. Mengalihkan...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium mb-1">Password Baru</label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input 
            type="password" 
            className="db-input w-full pl-9" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Min. 6 karakter"
          />
        </div>
      </div>
      {status === "error" && <p className="text-xs text-red-500 text-center">{msg}</p>}
      <button disabled={loading} className="db-btn-primary w-full flex justify-center py-2">
        {loading ? <Loader2 className="h-4 w-4 animate-spin"/> : "Simpan Password Baru"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="db-shell w-full max-w-md mx-auto p-6 db-animate-login">
      <div className="flex flex-col items-center gap-4 mb-6">
        <DeauBitLogo size={40} />
        <h1 className="text-lg font-bold">Reset Password</h1>
      </div>
      <div className="db-card p-5">
        <Suspense fallback={<div className="text-center text-xs">Loading...</div>}>
          <ResetContent />
        </Suspense>
      </div>
    </div>
  );
}