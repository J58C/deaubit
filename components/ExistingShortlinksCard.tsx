//components/ExistingShortlinksCard.tsx

"use client";

import { useState, useEffect } from "react";
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

function ShortlinkRow({ 
  link, 
  baseUrl, 
  getDomainLabel, 
  onViewStats, 
  onViewQr, 
  onCopy, 
  onDelete 
}: { 
  link: ShortLink;
  baseUrl: string;
  getDomainLabel: (url: string) => string;
  onViewStats: (slug: string) => void;
  onViewQr: (slug: string) => void;
  onCopy: (url: string) => void;
  onDelete: (slug: string) => void;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedExpire, setFormattedExpire] = useState("");

  const shortUrl = `${baseUrl}/${link.slug}`;
  const domainLabel = getDomainLabel(link.targetUrl);
  const initial = domainLabel.substring(0, 1).toUpperCase();

  useEffect(() => {
    setIsMounted(true);

    if (link.expiresAt) {
      setIsExpired(new Date(link.expiresAt) < new Date());
      setFormattedExpire(
        new Date(link.expiresAt).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
      );
    }
    setFormattedDate(
      new Date(link.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
    );
  }, [link.expiresAt, link.createdAt]);

  const LinkContent = () => (
    <div className="flex items-start gap-3 overflow-hidden">
      <div className="h-9 w-9 md:h-10 md:w-10 shrink-0 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs md:text-sm shadow-md">
        {initial}
      </div>
      
      <div className="flex flex-col min-w-0 flex-1">
        <a href={shortUrl} target="_blank" className="font-bold text-sm text-[var(--db-accent)] hover:underline truncate flex items-center gap-1">
          /{link.slug} <ExternalLink className="h-3 w-3 opacity-50" />
        </a>
        
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] md:text-xs text-[var(--db-text-muted)] mt-0.5">
          <span className="truncate max-w-[100px] md:max-w-[120px]">{domainLabel}</span>
          <span className="w-1 h-1 rounded-full bg-current opacity-50 hidden sm:inline-block" />
          
          <span className="opacity-70">
            {isMounted ? formattedDate : "..."}
          </span>

          {link.expiresAt && isMounted && (
            <div className={`ml-1 flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-medium border ${
              isExpired 
                ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:border-red-800' 
                : 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:border-orange-800'
            }`}>
              <Clock className="h-2.5 w-2.5" />
              <span>{isExpired ? 'Exp' : formattedExpire}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const ActionButtons = () => (
    <>
      <button onClick={() => onViewStats(link.slug)} className="p-1.5 md:p-2 rounded-lg hover:bg-[var(--db-surface-muted)] text-[var(--db-text-muted)] hover:text-[var(--db-accent)] transition-colors" title="Analytics">
          <BarChart3 className="h-4 w-4" />
      </button>
      <button onClick={() => onViewQr(link.slug)} className="p-1.5 md:p-2 rounded-lg hover:bg-[var(--db-surface-muted)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] transition-colors" title="QR Code">
          <QrCode className="h-4 w-4" />
      </button>
      <button onClick={() => onCopy(shortUrl)} className="p-1.5 md:p-2 rounded-lg hover:bg-[var(--db-surface-muted)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] transition-colors" title="Copy Link">
          <Copy className="h-4 w-4" />
      </button>
      <button onClick={() => onDelete(link.slug)} className="p-1.5 md:p-2 rounded-lg hover:bg-red-50 text-[var(--db-text-muted)] hover:text-red-500 transition-colors" title="Delete">
          <Trash2 className="h-4 w-4" />
      </button>
    </>
  );

  return (
    <div 
      className={`group relative p-3 rounded-xl border border-[var(--db-border-soft)] bg-[var(--db-surface)] hover:border-[var(--db-accent)] hover:shadow-lg hover:shadow-[var(--db-accent-glow)] transition-all duration-200 ${isMounted && isExpired ? 'opacity-60 grayscale' : ''}`}
    >
      <div className="flex flex-col gap-3 md:hidden">
        <LinkContent />
        <div className="flex items-center justify-between border-t border-[var(--db-border-soft)] pt-2 mt-1">
           <p className="text-[10px] text-[var(--db-text-muted)] truncate max-w-[150px]">{link.targetUrl}</p>
           <div className="flex items-center gap-1">
              <ActionButtons />
           </div>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
           <LinkContent />
        </div>
        <div className="absolute bottom-1 left-16 text-[10px] text-[var(--db-text-muted)] opacity-0 group-hover:opacity-60 transition-opacity truncate max-w-[300px] pointer-events-none hidden lg:block">
            {link.targetUrl}
        </div>
        <div className="flex items-center gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
           <ActionButtons />
        </div>
      </div>
    </div>
  );
}

export function ExistingShortlinksCard({
  links,
  loadingTable,
  baseUrl,
  getDomainLabel,
  onCopy,
  onDelete,
  onViewStats,
  onViewQr,
}: ExistingShortlinksCardProps) {

  return (
    <div className="db-card h-full flex flex-col overflow-hidden bg-[var(--db-surface)] relative">
      <div className="flex items-center justify-between border-b border-[var(--db-border-soft)] px-4 py-3 md:px-5 md:py-4">
        <div>
          <h2 className="text-sm md:text-base font-bold">Dashboard</h2>
          <p className="db-muted text-[10px] md:text-xs">Manage active links.</p>
        </div>
        <div className="flex items-center gap-2">
             {loadingTable && <span className="text-xs db-muted animate-pulse">Syncing...</span>}
             <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-[var(--db-surface-muted)] flex items-center justify-center text-xs font-bold border border-[var(--db-border)]">
                {links.length}
             </div>
        </div>
      </div>

      <div className="h-[500px] overflow-y-auto p-2">
        {links.length === 0 && !loadingTable ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
             <div className="h-12 w-12 md:h-16 md:w-16 bg-[var(--db-surface-muted)] rounded-full flex items-center justify-center mb-3">
                <Link2 className="h-6 w-6 md:h-8 md:w-8 text-[var(--db-text-muted)]" />
             </div>
             <p className="font-semibold text-sm">No links yet</p>
             <p className="text-xs db-muted max-w-[200px]">Create your first shortlink using the form.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {links.map((link) => (
              <ShortlinkRow 
                key={link.id}
                link={link}
                baseUrl={baseUrl}
                getDomainLabel={getDomainLabel}
                onViewStats={onViewStats}
                onViewQr={onViewQr}
                onCopy={onCopy}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
