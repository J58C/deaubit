//components/ExistingShortlinksCard.tsx

import { Copy, Trash2, Link2, QrCode, BarChart3, ExternalLink, Clock } from "lucide-react";

export interface ShortLink {
  id: string;
  slug: string;
  targetUrl: string;
  createdAt: string;
  expiresAt?: string | null;
}

interface ExistingShortlinksCardProps {
  links: ShortLink[];
  loadingTable: boolean;
  baseUrl: string;
  getDomainLabel: (url: string) => string;
  onCopy: (url: string) => void;
  onDelete: (slug: string) => void;
  onViewTarget: (link: ShortLink) => void;
  onViewStats: (slug: string) => void;
  onViewQr: (slug: string) => void;
}

export function ExistingShortlinksCard({
  links,
  loadingTable,
  baseUrl,
  getDomainLabel,
  onCopy,
  onDelete,
  onViewTarget,
  onViewStats,
  onViewQr,
}: ExistingShortlinksCardProps) {

  const getDomainInitials = (domain: string) => {
    return domain.substring(0, 1).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="db-card h-full flex flex-col overflow-hidden bg-[var(--db-surface)] relative">
      <div className="flex items-center justify-between border-b border-[var(--db-border-soft)] px-5 py-4">
        <div>
          <h2 className="text-base font-bold">Dashboard</h2>
          <p className="db-muted text-xs">Manage your active links.</p>
        </div>
        <div className="flex items-center gap-2">
             {loadingTable && <span className="text-xs db-muted animate-pulse">Syncing...</span>}
             <div className="h-8 w-8 rounded-full bg-[var(--db-surface-muted)] flex items-center justify-center text-xs font-bold border border-[var(--db-border)]">
                {links.length}
             </div>
        </div>
      </div>

      <div className="h-[500px] overflow-y-auto p-2">
        {links.length === 0 && !loadingTable ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
             <div className="h-16 w-16 bg-[var(--db-surface-muted)] rounded-full flex items-center justify-center mb-3">
                <Link2 className="h-8 w-8 text-[var(--db-text-muted)]" />
             </div>
             <p className="font-semibold text-sm">No links yet</p>
             <p className="text-xs db-muted max-w-[200px]">Create your first shortlink using the form.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {links.map((link) => {
              const shortUrl = `${baseUrl}/${link.slug}`;
              const domainLabel = getDomainLabel(link.targetUrl);
              const initial = getDomainInitials(domainLabel);
              
              const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date();

              return (
                <div key={link.id} className={`group relative p-3 rounded-xl border border-[var(--db-border-soft)] bg-[var(--db-surface)] hover:border-[var(--db-accent)] hover:shadow-lg hover:shadow-[var(--db-accent-glow)] transition-all duration-200 ${isExpired ? 'opacity-60 grayscale' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    
                    <div className="flex items-start gap-3 overflow-hidden">
                       <div className="h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {initial}
                       </div>
                       <div className="flex flex-col min-w-0">
                          <a href={shortUrl} target="_blank" className="font-bold text-sm text-[var(--db-accent)] hover:underline truncate flex items-center gap-1">
                             /{link.slug} <ExternalLink className="h-3 w-3 opacity-50" />
                          </a>
                          
                          <div className="flex items-center flex-wrap gap-1.5 text-xs text-[var(--db-text-muted)] mt-0.5">
                            <span className="truncate max-w-[120px]">{domainLabel}</span>
                            <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                            <span className="opacity-70">{formatDate(link.createdAt)}</span>

                            {link.expiresAt && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                                <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                                  isExpired 
                                    ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:border-red-800' 
                                    : 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:border-orange-800'
                                }`}>
                                  <Clock className="h-3 w-3" />
                                  <span>{isExpired ? 'Expired' : formatDate(link.expiresAt)}</span>
                                </div>
                              </>
                            )}
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onViewStats(link.slug)} className="p-2 rounded-lg hover:bg-[var(--db-surface-muted)] text-[var(--db-text-muted)] hover:text-[var(--db-accent)] transition-colors" title="Analytics">
                         <BarChart3 className="h-4 w-4" />
                      </button>
                      <button onClick={() => onViewQr(link.slug)} className="p-2 rounded-lg hover:bg-[var(--db-surface-muted)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] transition-colors" title="QR Code">
                         <QrCode className="h-4 w-4" />
                      </button>
                      <button onClick={() => onCopy(shortUrl)} className="p-2 rounded-lg hover:bg-[var(--db-surface-muted)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] transition-colors" title="Copy Link">
                         <Copy className="h-4 w-4" />
                      </button>
                      <button onClick={() => onDelete(link.slug)} className="p-2 rounded-lg hover:bg-red-50 text-[var(--db-text-muted)] hover:text-red-500 transition-colors" title="Delete">
                         <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-[10px] text-[var(--db-text-muted)] opacity-60 truncate px-1 font-mono">
                    {link.targetUrl}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
