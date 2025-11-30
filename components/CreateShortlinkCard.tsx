//components/CreateShortlinkCard.tsx

import { Calendar, Lock, Link2, Type, ArrowRight, Loader2 } from "lucide-react";

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
  targetUrl,
  slug,
  password,
  expiresAt,
  loading,
  error,
  onSubmit,
  onChangeTarget,
  onChangeSlug,
  onChangePassword,
  onChangeExpiresAt,
}: CreateShortlinkCardProps) {
  
  return (
    <div className="db-card db-card-raise db-animate p-5 h-full flex flex-col bg-gradient-to-br from-[var(--db-surface)] to-[var(--db-surface-muted)]">
      <div className="mb-4">
        <h2 className="text-base font-bold flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[var(--db-accent-soft)] text-[var(--db-accent-text)]">
            <Link2 className="h-4 w-4" />
          </div>
          Create Link
        </h2>
        <p className="text-xs db-muted mt-1 ml-1">Paste your long URL below.</p>
      </div>

      <form className="space-y-4 flex-1 flex flex-col" onSubmit={onSubmit}>
        
        <div className="space-y-1.5">
          <label className="text-xs font-semibold ml-1">Destination URL</label>
          <div className="relative group">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--db-text-muted)] group-focus-within:text-[var(--db-accent)] transition-colors" />
            <input
              className="db-input pl-9"
              placeholder="https://example.com/very-long-url"
              value={targetUrl}
              onChange={(e) => onChangeTarget(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold ml-1">Custom Slug <span className="font-normal text-[var(--db-text-muted)]">(Optional)</span></label>
          <div className="relative group">
            <Type className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--db-text-muted)] group-focus-within:text-[var(--db-accent)] transition-colors" />
            <input
              className="db-input pl-9 font-mono text-sm"
              placeholder="my-custom-link"
              value={slug}
              onChange={(e) => onChangeSlug(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="border-t border-[var(--db-border-soft)] my-2 opacity-50" />
        <p className="text-[10px] font-semibold uppercase tracking-wider db-muted ml-1">Advanced Options</p>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold ml-1">Password Protection</label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--db-text-muted)] group-focus-within:text-[var(--db-accent)] transition-colors" />
            <input
              type="text"
              className="db-input pl-9"
              placeholder="Leave empty for public access"
              value={password}
              onChange={(e) => onChangePassword(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold ml-1">Expiration Date</label>
          <div className="relative group">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--db-text-muted)] group-focus-within:text-[var(--db-accent)] transition-colors" />
            <input
              type="datetime-local"
              className="db-input pl-9" 
              value={expiresAt}
              onChange={(e) => onChangeExpiresAt(e.target.value)}
              disabled={loading}
              style={{ colorScheme: 'light' }}
            />
          </div>
        </div>

        {error && (
          <div className="text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg border border-red-200 dark:border-red-900/50 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
            <span className="block h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            {error}
          </div>
        )}

        <div className="mt-auto pt-4">
          <button
            type="submit"
            disabled={loading || !targetUrl}
            className="db-btn-primary w-full flex items-center justify-center gap-2 h-11 text-sm shadow-lg shadow-blue-500/20 disabled:shadow-none disabled:opacity-70 transition-all"
          >
            {loading ? (
              <>Saving Link... <Loader2 className="h-4 w-4 animate-spin ml-1" /></>
            ) : (
              <>Create Shortlink <ArrowRight className="h-4 w-4 ml-1" /></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
