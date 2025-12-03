//components/ExistingShortlinksCard.tsx

"use client";

import { useState, useEffect } from "react";
import { Copy, Trash2, QrCode, BarChart3, ExternalLink, Clock, AlertTriangle } from "lucide-react";

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

function ShortlinkRow({ link, baseUrl, getDomainLabel, onViewStats, onViewQr, onCopy, onDelete }: any) {
  const [isMounted, setIsMounted] = useState(false);
  const shortUrl = `${baseUrl}/${link.slug}`;
  const domainLabel = getDomainLabel(link.targetUrl);

  useEffect(() => { setIsMounted(true); }, []);

  const getExpiryStatus = () => {
    if (!link.expiresAt) return null;
    const now = new Date();
    const expiry = new Date(link.expiresAt);
    const isExpired = now > expiry;
    
    const dateStr = expiry.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

    if (isExpired) {
      return (
        <span className="text-[10px] bg-red-100 text-red-800 border-2 border-[var(--db-border)] px-2 py-0.5 flex items-center gap-1 font-bold whitespace-nowrap">
           <AlertTriangle className="h-3 w-3"/> EXPIRED
        </span>
      );
    }
    return (
      <span className="text-[10px] bg-orange-100 text-orange-800 border-2 border-[var(--db-border)] px-2 py-0.5 flex items-center gap-1 font-bold whitespace-nowrap" title={`Expires on ${expiry.toLocaleString()}`}>
         <Clock className="h-3 w-3"/> {dateStr}
      </span>
    );
  };

  return (
    <div className="group relative bg-[var(--db-surface)] border-2 border-[var(--db-border)] p-3 md:p-4 shadow-[3px_3px_0px_0px_var(--db-border)] md:shadow-[4px_4px_0px_0px_var(--db-border)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_var(--db-border)] transition-all flex flex-col justify-between h-full">
      
      <div className="min-w-0 mb-3">
          <div className="flex flex-wrap items-center gap-2 mb-2">
              <a href={shortUrl} target="_blank" className="bg-[var(--db-accent)] text-[var(--db-accent-fg)] text-xs md:text-sm font-black px-2 md:px-3 py-1 border-2 border-[var(--db-border)] hover:opacity-80 transition-opacity flex items-center gap-1 cursor-pointer truncate max-w-full">
                  /{link.slug} <ExternalLink className="h-3 w-3"/>
              </a>
              {isMounted && getExpiryStatus()}
          </div>
          
          <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-[var(--db-text-muted)] font-mono bg-[var(--db-bg)] p-1.5 md:p-2 border border-[var(--db-border)] w-full">
              <span className="truncate flex-1 block text-[var(--db-text)]" title={link.targetUrl}>{domainLabel}</span>
              <span>•</span>
              <span className="whitespace-nowrap">{isMounted ? new Date(link.createdAt).toLocaleDateString() : "..."}</span>
          </div>
      </div>

      <div className="grid grid-cols-4 gap-2 pt-3 border-t-2 border-dashed border-[var(--db-border)] mt-auto">
          <button onClick={() => onViewStats(link.slug)} className="p-1.5 border-2 border-[var(--db-border)] bg-blue-100 text-blue-900 hover:bg-blue-300 hover:-translate-y-1 transition-all cursor-pointer flex justify-center items-center" title="Stats">
              <BarChart3 className="h-4 w-4" />
          </button>
          <button onClick={() => onViewQr(link.slug)} className="p-1.5 border-2 border-[var(--db-border)] bg-yellow-100 text-yellow-900 hover:bg-yellow-300 hover:-translate-y-1 transition-all cursor-pointer flex justify-center items-center" title="QR">
              <QrCode className="h-4 w-4" />
          </button>
          <button onClick={() => onCopy(shortUrl)} className="p-1.5 border-2 border-[var(--db-border)] bg-green-100 text-green-900 hover:bg-green-300 hover:-translate-y-1 transition-all cursor-pointer flex justify-center items-center" title="Copy">
              <Copy className="h-4 w-4" />
          </button>
          <button onClick={() => onDelete(link.slug)} className="p-1.5 border-2 border-[var(--db-border)] bg-red-100 text-red-900 hover:bg-red-300 hover:-translate-y-1 transition-all cursor-pointer flex justify-center items-center" title="Delete">
              <Trash2 className="h-4 w-4" />
          </button>
      </div>
    </div>
  );
}

export function ExistingShortlinksCard({ links, loadingTable, baseUrl, getDomainLabel, onCopy, onDelete, onViewStats, onViewQr }: ExistingShortlinksCardProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 md:mb-6 flex items-center justify-between border-b-4 border-[var(--db-border)] pb-2 md:pb-4">
        <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter text-[var(--db-text)]">Active Links</h2>
        <span className="bg-[var(--db-text)] text-[var(--db-bg)] px-3 md:px-4 py-1 font-mono font-bold text-sm md:text-lg border-2 border-[var(--db-bg)] shadow-[2px_2px_0px_0px_var(--db-text-muted)]">{links.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 md:pr-2 pb-10">
        {loadingTable ? (
            <div className="text-center p-10 font-bold animate-pulse text-[var(--db-text-muted)]">LOADING DATA...</div>
        ) : links.length === 0 ? (
            <div className="border-4 border-[var(--db-border)] border-dashed p-8 md:p-12 text-center bg-[var(--db-surface)]">
                <p className="font-black text-lg md:text-xl mb-2 text-[var(--db-text)]">ZONK! NO LINKS.</p>
                <p className="text-xs md:text-sm font-medium text-[var(--db-text-muted)]">Create your first link on the panel.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {links.map((link) => (
                  <ShortlinkRow 
                    key={link.id} 
                    link={link} 
                    baseUrl={baseUrl} 
                    getDomainLabel={getDomainLabel} 
                    onCopy={onCopy} onDelete={onDelete} 
                    onViewStats={onViewStats} onViewQr={onViewQr} 
                  />
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
