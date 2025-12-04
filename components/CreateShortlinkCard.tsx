//components/CreateShortlinkCard.tsx

"use client";

import { useState } from "react";
import { Calendar, Lock, Link2, ArrowRight, Loader2, ChevronDown, ChevronUp, Settings2 } from "lucide-react";

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
  
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[var(--db-surface)] border-2 md:border-4 border-[var(--db-border)] p-4 lg:p-5 shadow-[6px_6px_0px_0px_var(--db-border)] lg:shadow-[8px_8px_0px_0px_var(--db-border)]">
      
      <div className="mb-4 lg:mb-5 flex items-center gap-3 border-b-2 md:border-b-4 border-[var(--db-border)] pb-3">
        <div className="bg-[var(--db-accent)] p-1.5 border-2 border-[var(--db-border)] shadow-[2px_2px_0px_0px_var(--db-border)]">
            <Link2 className="h-5 w-5 text-[var(--db-accent-fg)]" />
        </div>
        <h2 className="text-lg lg:text-xl font-black uppercase tracking-tighter text-[var(--db-text)]">New Link</h2>
      </div>

      <form className="space-y-4" onSubmit={onSubmit} autoComplete="off">
        
        <div className="space-y-1">
          <label className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-[var(--db-text-muted)]">Target URL</label>
          <input
            className="w-full bg-[var(--db-bg)] border-2 border-[var(--db-border)] px-3 py-2.5 text-sm font-bold text-[var(--db-text)] focus:outline-none focus:bg-[var(--db-surface)] focus:shadow-[4px_4px_0px_0px_var(--db-border)] transition-all placeholder:font-normal"
            placeholder="https://example.com"
            value={targetUrl}
            onChange={(e) => onChangeTarget(e.target.value)}
            required
            disabled={loading}
            autoComplete="off"
            name="target_url_unique"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-[var(--db-text-muted)]">Custom Slug (Optional)</label>
          <div className="flex">
            <span className="bg-[var(--db-text-muted)] text-[var(--db-bg)] px-3 py-2.5 text-sm font-mono font-bold flex items-center border-2 border-[var(--db-border)] border-r-0">/</span>
            <input
              className="w-full bg-[var(--db-bg)] border-2 border-[var(--db-border)] px-3 py-2.5 text-sm font-bold text-[var(--db-text)] focus:outline-none focus:bg-[var(--db-surface)] focus:shadow-[4px_4px_0px_0px_var(--db-border)] transition-all placeholder:font-normal"
              placeholder="link"
              value={slug}
              onChange={(e) => onChangeSlug(e.target.value)}
              disabled={loading}
              autoComplete="off"
              name="slug_unique"
            />
          </div>
        </div>

        <div className="border-2 border-[var(--db-border)] bg-[var(--db-bg)] transition-all">
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-3 focus:outline-none hover:bg-[var(--db-surface)] active:bg-[var(--db-bg)] transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Settings2 className="h-4 w-4 text-[var(--db-text-muted)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--db-text-muted)]">
                        Advanced Settings {(password || expiresAt) && <span className="text-[var(--db-primary)]">• Active</span>}
                    </span>
                </div>
                {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-[var(--db-text)]" />
                ) : (
                    <ChevronDown className="h-4 w-4 text-[var(--db-text)]" />
                )}
            </button>
            
            {isExpanded && (
                <div className="p-3 pt-0 grid grid-cols-1 gap-3 animate-in slide-in-from-top-1 fade-in duration-200">
                    <div className="h-[1px] bg-[var(--db-border)]/20 mb-1 w-full"></div>
                    
                    <div className="flex items-center gap-2 bg-[var(--db-surface)] border-2 border-[var(--db-border)] px-2 py-2 focus-within:shadow-[2px_2px_0px_0px_var(--db-border)] transition-shadow">
                        <Lock className="h-4 w-4 text-[var(--db-text)] shrink-0" />
                        <input
                            type="text"
                            className="w-full bg-transparent border-none text-xs font-medium text-[var(--db-text)] focus:ring-0 focus:outline-none p-0 placeholder:text-[var(--db-text-muted)]"
                            placeholder="Password Protection (Optional)"
                            value={password}
                            onChange={(e) => onChangePassword(e.target.value)}
                            disabled={loading}
                            
                            autoComplete="new-password" 
                            name="link_lock_password_unique" 
                            data-lpignore="true" 
                        />
                    </div>
                    
                    <div className="flex items-center gap-2 bg-[var(--db-surface)] border-2 border-[var(--db-border)] px-2 py-2 focus-within:shadow-[2px_2px_0px_0px_var(--db-border)] transition-shadow">
                        <Calendar className="h-4 w-4 text-[var(--db-text)] shrink-0" />
                        <input
                            type="datetime-local"
                            className="w-full bg-transparent border-none text-xs font-medium text-[var(--db-text)] focus:ring-0 focus:outline-none p-0"
                            value={expiresAt}
                            onChange={(e) => onChangeExpiresAt(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                </div>
            )}
        </div>

        {error && (
          <div className="bg-[var(--db-danger)] text-[var(--db-danger-fg)] text-[10px] lg:text-xs font-bold p-2 lg:p-3 border-2 border-[var(--db-border)] shadow-[2px_2px_0px_0px_var(--db-border)]">
            ❌ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !targetUrl}
          className="w-full bg-[var(--db-primary)] text-[var(--db-primary-fg)] border-2 border-[var(--db-border)] py-3 lg:py-4 font-black text-xs lg:text-sm uppercase tracking-widest shadow-[4px_4px_0px_0px_var(--db-border)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--db-border)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin"/> : <><ArrowRight className="h-5 w-5" /> SHORTEN IT!</>}
        </button>
      </form>
    </div>
  );
}
