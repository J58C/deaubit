interface CreateShortlinkCardProps {
  targetUrl: string;
  slug: string;
  loading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
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
  return (
    <div className="db-card db-card-raise db-animate p-4 space-y-3 h-full flex flex-col">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-sm font-semibold">Create new shortlink</h2>
        <p className="db-muted">
          Satu form singkat untuk menambahkan link baru.
        </p>
      </div>

      <div
        style={{
          borderBottom: "1px solid var(--db-border-soft)",
          marginTop: "0.25rem",
        }}
      />

      <form className="space-y-3 pt-1 flex-1 flex flex-col" onSubmit={onSubmit}>
        <div className="space-y-1.5">
          <label className="block text-xs font-medium">Target URL</label>
          <input
            className="db-input w-full"
            placeholder="https://example.com"
            value={targetUrl}
            onChange={(e) => onChangeTarget(e.target.value)}
            required
          />
          <p className="db-muted">
            Pastikan URL sudah lengkap dengan{" "}
            <code className="font-mono text-[0.7rem]">https://</code>.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium">
            Custom slug
          </label>
          <input
            className="db-input w-full"
            placeholder="Optional"
            value={slug}
            onChange={(e) => onChangeSlug(e.target.value)}
          />
          <p className="db-muted">Biarkan kosong kalau mau slug acak.</p>
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
            className="db-btn-primary inline-flex items-center justify-center gap-2"
          >
            {loading ? "Saving…" : "Create shortlink"}
          </button>
        </div>
      </form>
    </div>
  );
}
