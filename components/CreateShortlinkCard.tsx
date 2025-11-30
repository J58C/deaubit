//components/CreateShortlinkCard.tsx

import { useState } from "react";
import { Calendar, Lock } from "lucide-react";

interface CreateShortlinkCardProps {
  targetUrl: string;
  slug: string;
  loading: boolean;
  error: string | null;
  onSubmit: (
    e: React.FormEvent<HTMLFormElement>, 
    extras: { password?: string, expiresAt?: string }
  ) => void;
  onChangeTarget: (value: string) => void;
  onChangeSlug: (value: string) => void;
}

export function CreateShortlinkCard({
  targetUrl,
  slug,
  loading,
  error,
  onSubmit,
  onChangeTarget,
  onChangeSlug,
}: CreateShortlinkCardProps) {
  
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    onSubmit(e, { 
      password: password || undefined, 
      expiresAt: expiresAt || undefined 
    });
    
    // Reset lokal form jika tidak loading (optimistic reset)
    // Note: Idealnya reset dipanggil oleh parent saat sukses, tapi ini shortcut agar UX lancar
    if (!loading) {
       // Optional: reset fields here if needed
    }
  };

  return (
    <div className="db-card db-card-raise db-animate p-4 space-y-3 h-full flex flex-col">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-sm font-semibold">Create new shortlink</h2>
        <p className="db-muted">
          Form singkat untuk menambahkan link baru.
        </p>
      </div>

      <div className="border-b border-(--db-border-soft) mt-1" />

      <form className="space-y-3 pt-1 flex-1 flex flex-col" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label className="block text-xs font-medium">Target URL</label>
          <input
            className="db-input w-full"
            placeholder="https://example.com"
            value={targetUrl}
            onChange={(e) => onChangeTarget(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium">
            Custom slug (Optional)
          </label>
          <input
            className="db-input w-full"
            placeholder="my-link"
            value={slug}
            onChange={(e) => onChangeSlug(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-1 text-xs font-medium">
            <Lock className="h-3 w-3" /> Password Protection
          </label>
          <input
            type="text" 
            className="db-input w-full"
            placeholder="Biarkan kosong jika publik"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-1 text-xs font-medium">
            <Calendar className="h-3 w-3" /> Expires At
          </label>
          <input
            type="datetime-local"
            className="db-input w-full"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </div>

        {error && (
          <p
            className="text-[0.7rem] rounded-lg border px-3 py-2"
            style={{
              borderColor: "rgba(248, 113, 113, 0.5)",
              backgroundColor: "var(--db-danger-soft)",
            }}
          >
            {error}
          </p>
        )}

        <div className="flex items-center justify-end pt-1 mt-auto">
          <button
            type="submit"
            disabled={loading}
            className="db-btn-primary inline-flex items-center justify-center gap-2 w-full"
          >
            {loading ? "Saving…" : "Create shortlink"}
          </button>
        </div>
      </form>
    </div>
  );
}
