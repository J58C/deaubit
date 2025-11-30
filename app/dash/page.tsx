//app/dash/page.tsx

"use client";

import { useEffect, useState } from "react";
import {
  LogOut,
  ExternalLink,
  X,
  Loader2,
  Trash2,
} from "lucide-react";
import DeauBitLogo from "@/components/DeauBitLogo";
import {
  ExistingShortlinksCard,
  ShortLink,
} from "@/components/ExistingShortlinksCard";
import { CreateShortlinkCard } from "@/components/CreateShortlinkCard";
import AnalyticsModal from "@/components/AnalyticsModal";
import QrCodeModal from "@/components/QrCodeModal"; 

export default function DashboardPage() {
  const [links, setLinks] = useState<ShortLink[]>([]);
  
  const [targetUrl, setTargetUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [password, setPassword] = useState(""); 
  const [expiresAt, setExpiresAt] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedLink, setSelectedLink] = useState<ShortLink | null>(null);
  const [analyticsSlug, setAnalyticsSlug] = useState<string | null>(null);
  const [qrSlug, setQrSlug] = useState<string | null>(null); 

  const [pendingDelete, setPendingDelete] = useState<ShortLink | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function fetchLinks() {
    setLoadingTable(true);
    setError(null);
    try {
      const res = await fetch("/api/links");
      const data = await res.json();
      setLinks(data);
    } catch {
      setError("Failed to load links");
    } finally {
      setLoadingTable(false);
    }
  }

  useEffect(() => {
    fetchLinks().catch(console.error);
  }, []);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUrl,
          slug: slug || undefined,
          password: password || undefined,
          expiresAt: expiresAt || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create");

      setTargetUrl("");
      setSlug("");
      setPassword(""); 
      setExpiresAt("");
      
      await fetchLinks();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function requestDelete(slug: string) {
    const link = links.find((l) => l.slug === slug) || null;
    setPendingDelete(link);
    setDeleteError(null);
  }

  async function confirmDelete() {
    if (!pendingDelete) return;

    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/links/${pendingDelete.slug}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({} as unknown));
        throw new Error(data.error || "Failed to delete");
      }

      setPendingDelete(null);
      await fetchLinks();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setDeleteError(msg);
    } finally {
      setDeleteLoading(false);
    }
  }

  function cancelDelete() {
    setPendingDelete(null);
    setDeleteError(null);
  }

  async function handleLogout() {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
    } finally {
      window.location.href = "/";
    }
  }

  const envBaseUrl =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_BASE_URL
      : undefined;

  const baseUrl =
    (envBaseUrl && envBaseUrl.replace(/\/+$/, "")) ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000");

  function getDomainLabel(url: string): string {
    try {
      const u = new URL(url);
      return u.hostname;
    } catch {
      return url;
    }
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      alert("Gagal menyalin ke clipboard");
    }
  }

  return (
    <>
      <div className="w-full max-w-6xl mx-auto space-y-4 md:space-y-6 pb-10 px-2 md:px-4">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--db-border-soft)] pb-4 mt-2">
          <div className="flex items-center gap-2 md:gap-3">
            <DeauBitLogo size={36} />
            <div className="flex flex-col">
              <span className="text-base md:text-lg font-bold tracking-tight text-[var(--db-text)]">
                DeauBit
              </span>
              <span className="text-[10px] md:text-xs db-muted">
                URL Shortener
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--db-surface-muted)] border border-[var(--db-border)]">
                <span className="db-status-dot" />
                <span className="text-[10px] font-medium text-[var(--db-text-muted)]">Operational</span>
             </div>
            <button
              onClick={handleLogout}
              className="db-btn-ghost inline-flex items-center gap-1.5 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 text-xs md:text-sm"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
           <div className="p-3 md:p-4 rounded-xl bg-[var(--db-surface)] border border-[var(--db-border-soft)] shadow-sm">
              <p className="text-[10px] md:text-xs db-muted mb-1">Total Active Links</p>
              <p className="text-xl md:text-2xl font-bold font-mono">{links.length}</p>
           </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 h-full order-2 lg:order-1">
            <ExistingShortlinksCard
              links={links}
              loadingTable={loadingTable}
              baseUrl={baseUrl}
              getDomainLabel={getDomainLabel}
              onCopy={copyToClipboard}
              onDelete={requestDelete}
              onViewTarget={(link) => setSelectedLink(link)}
              onViewStats={(slug) => setAnalyticsSlug(slug)}
              onViewQr={(slug) => setQrSlug(slug)}
            />
          </div>

          <div className="lg:col-span-4 h-full sticky top-4 order-1 lg:order-2">
            <CreateShortlinkCard
              targetUrl={targetUrl}
              slug={slug}
              password={password}
              expiresAt={expiresAt}
              loading={loading}
              error={error}
              onSubmit={handleCreate}
              onChangeTarget={setTargetUrl}
              onChangeSlug={setSlug}
              onChangePassword={setPassword}
              onChangeExpiresAt={setExpiresAt}
            />
          </div>
        </section>
      </div>

      {analyticsSlug && (
        <AnalyticsModal 
          slug={analyticsSlug} 
          onClose={() => setAnalyticsSlug(null)} 
        />
      )}

      {qrSlug && (
        <QrCodeModal
          slug={qrSlug}
          shortUrl={`${baseUrl}/${qrSlug}`}
          onClose={() => setQrSlug(null)}
        />
      )}

      {selectedLink && (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4 animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedLink(null)}
          />
          <div className="relative w-full max-w-lg db-card db-card-pop p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-bold flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-[var(--db-accent)]"/> Full Target URL
                </span>
                <span className="db-muted text-[10px] mt-0.5">/{selectedLink.slug}</span>
              </div>
              <button className="db-btn-icon" onClick={() => setSelectedLink(null)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-3 rounded-lg bg-[var(--db-surface-muted)] border border-[var(--db-border)] break-all font-mono text-xs">
              {selectedLink.targetUrl}
            </div>
            <div className="flex justify-end gap-2">
              <button className="db-btn-ghost text-xs" onClick={() => copyToClipboard(selectedLink.targetUrl)}>Copy URL</button>
              <a href={selectedLink.targetUrl} target="_blank" rel="noreferrer" className="db-btn-primary text-xs">Open Link</a>
            </div>
          </div>
        </div>
      )}

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={cancelDelete}
          />
          <div className="relative w-full max-w-sm db-card db-card-pop p-6 space-y-4 shadow-2xl border-red-100 dark:border-red-900/30">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-full">
                 <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold">Delete Link?</h3>
            </div>
            <p className="text-sm db-muted">
              Are you sure you want to delete <span className="font-mono font-bold text-[var(--db-text)]">/{pendingDelete.slug}</span>? This action cannot be undone.
            </p>
            {deleteError && (
              <p className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">{deleteError}</p>
            )}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={cancelDelete} disabled={deleteLoading} className="db-btn-ghost text-xs">Cancel</button>
              <button onClick={confirmDelete} disabled={deleteLoading} className="db-btn-primary bg-red-600 hover:bg-red-700 text-white border-transparent text-xs">
                {deleteLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : "Delete Forever"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
