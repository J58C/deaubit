//components/CreateShortlinkCard.tsx

import { Calendar, Lock, Link2, ArrowRight, Loader2 } from "lucide-react";

interface CreateShortlinkCardProps {
  targetUrl: string;
  slug: string;
  password: string;
  expiresAt: string;
  loading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChangeTarget: (value: string) => void;
  onChangeSlug: (value: string) => void;
  onChangePassword: (value: string) => void;
  onChangeExpiresAt: (value: string) => void;
}

export function CreateShortlinkCard({
  targetUrl, slug, password, expiresAt, loading, error, onSubmit,
  onChangeTarget, onChangeSlug, onChangePassword, onChangeExpiresAt,
}: CreateShortlinkCardProps) {
  
  return (
    <div className="bg-[var(--db-surface)] border-2 md:border-4 border-[var(--db-border)] p-6 shadow-[8px_8px_0px_0px_var(--db-border)]">
      <div className="mb-6 flex items-center gap-3 border-b-2 md:border-b-4 border-[var(--db-border)] pb-4">
        <div className="bg-[var(--db-accent)] p-2 border-2 border-[var(--db-border)] shadow-[2px_2px_0px_0px_var(--db-border)]">
            <Link2 className="h-6 w-6 text-[var(--db-accent-fg)]" />
        </div>
        <h2 className="text-xl font-black uppercase tracking-tighter text-[var(--db-text)]">New Link</h2>
      </div>

      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-[var(--db-text-muted)]">Target URL</label>
          <input
            className="w-full bg-[var(--db-bg)] border-2 border-[var(--db-border)] px-4 py-3 text-sm font-bold text-[var(--db-text)] focus:outline-none focus:bg-[var(--db-surface)] focus:shadow-[4px_4px_0px_0px_var(--db-border)] transition-all placeholder:font-normal"
            placeholder="https://very-long-url.com/..."
            value={targetUrl}
            onChange={(e) => onChangeTarget(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-[var(--db-text-muted)]">Custom Slug (Optional)</label>
          <div className="flex">
            <span className="bg-[var(--db-text-muted)] text-[var(--db-bg)] px-3 py-3 text-sm font-mono font-bold flex items-center">/</span>
            <input
              className="w-full bg-[var(--db-bg)] border-2 border-[var(--db-border)] border-l-0 px-4 py-3 text-sm font-bold text-[var(--db-text)] focus:outline-none focus:bg-[var(--db-surface)] focus:shadow-[4px_4px_0px_0px_var(--db-border)] transition-all placeholder:font-normal"
              placeholder="my-link"
              value={slug}
              onChange={(e) => onChangeSlug(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="p-4 border-2 border-[var(--db-border)] bg-[var(--db-bg)] space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--db-text-muted)]">Advanced Settings</p>
            
            <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-[var(--db-text)]" />
                    <input
                        type="text"
                        className="w-full bg-[var(--db-surface)] border-2 border-[var(--db-border)] px-3 py-2 text-xs font-medium text-[var(--db-text)] focus:outline-none focus:shadow-[2px_2px_0px_0px_var(--db-border)]"
                        placeholder="Password (Optional)"
                        value={password}
                        onChange={(e) => onChangePassword(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[var(--db-text)]" />
                    <input
                        type="datetime-local"
                        className="w-full bg-[var(--db-surface)] border-2 border-[var(--db-border)] px-3 py-2 text-xs font-medium text-[var(--db-text)] focus:outline-none focus:shadow-[2px_2px_0px_0px_var(--db-border)]"
                        value={expiresAt}
                        onChange={(e) => onChangeExpiresAt(e.target.value)}
                        disabled={loading}
                    />
                </div>
            </div>
        </div>

        {error && (
          <div className="bg-[var(--db-danger)] text-[var(--db-danger-fg)] text-xs font-bold p-3 border-2 border-[var(--db-border)] shadow-[2px_2px_0px_0px_var(--db-border)]">
            ❌ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !targetUrl}
          className="w-full bg-[var(--db-primary)] text-[var(--db-primary-fg)] border-2 border-[var(--db-border)] py-4 font-black text-sm uppercase tracking-widest shadow-[4px_4px_0px_0px_var(--db-border)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--db-border)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin"/> : <><ArrowRight className="h-5 w-5" /> SHORTEN IT!</>}
        </button>
      </form>
    </div>
  );
}
