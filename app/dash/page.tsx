//app/dash/page.tsx

"use client";

import { useEffect, useState } from "react";
import DeauBitLogo from "@/components/DeauBitLogo";
import UserMenu from "@/components/UserMenu";
import { ExistingShortlinksCard, ShortLink } from "@/components/ExistingShortlinksCard";
import { CreateShortlinkCard } from "@/components/CreateShortlinkCard";
import AnalyticsModal from "@/components/AnalyticsModal";
import QrCodeModal from "@/components/QrCodeModal";
import { Trash2, X, ExternalLink } from "lucide-react";

export default function DashboardPage() {
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [userEmail, setUserEmail] = useState("User");
  
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

  useEffect(() => {
    fetch("/api/session").then(r => r.json()).then(data => {
        if(data.user?.email) setUserEmail(data.user.email);
        if(data.user?.name) setUserEmail(data.user.name);
    });
    fetchLinks();
  }, []);

  async function fetchLinks() {
    setLoadingTable(true);
    try {
      const res = await fetch("/api/links");
      const data = await res.json();
      setLinks(Array.isArray(data) ? data : []);
    } catch {

    } finally {
      setLoadingTable(false);
    }
  }

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
      if (!res.ok) throw new Error(data.error || "Failed");

      setTargetUrl(""); setSlug(""); setPassword(""); setExpiresAt("");
      await fetchLinks();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleteLoading(true);
    try {
        await fetch(`/api/links/${pendingDelete.slug}`, { method: "DELETE" });
        setPendingDelete(null);
        await fetchLinks();
    } finally {
        setDeleteLoading(false);
    }
  }

  const shortHost = process.env.NEXT_PUBLIC_SHORT_HOST || process.env.NEXT_PUBLIC_APP_HOST;
  const protocol = process.env.NEXT_PUBLIC_PROTOCOL || "https";
  
  const baseUrl = shortHost 
    ? `${protocol}://${shortHost}`
    : (typeof window !== "undefined" ? window.location.origin : "");

  const getDomainLabel = (url: string) => { 
    try { return new URL(url).hostname; } catch { return url; } 
  };
  
  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text).catch(() => {});

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-32">
      
      <header className="bg-[var(--db-surface)] border-4 border-[var(--db-border)] p-4 shadow-[8px_8px_0px_0px_var(--db-border)] flex items-center justify-between sticky top-4 z-30 transition-colors">
        <div className="flex items-center gap-3">
          <div className="bg-[var(--db-text)] p-1">
             <DeauBitLogo size={28} />
          </div>
          <span className="text-xl font-black uppercase tracking-tighter hidden sm:block text-[var(--db-text)]">Dashboard</span>
        </div>
        <UserMenu username={userEmail} />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start relative">
        
        <div className="order-2 lg:order-1 min-w-0 space-y-6">
            <ExistingShortlinksCard
              links={links}
              loadingTable={loadingTable}
              baseUrl={baseUrl}
              getDomainLabel={getDomainLabel}
              onCopy={copyToClipboard}
              onDelete={(slug) => setPendingDelete(links.find(l => l.slug === slug) || null)}
              onViewTarget={(link) => setSelectedLink(link)}
              onViewStats={(slug) => setAnalyticsSlug(slug)}
              onViewQr={(slug) => setQrSlug(slug)}
            />
        </div>

        <div className="order-1 lg:order-2 lg:sticky lg:top-30 h-fit z-10 transition-all duration-300">
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
      </div>

      {analyticsSlug && <AnalyticsModal slug={analyticsSlug} onClose={() => setAnalyticsSlug(null)} />}
      {qrSlug && <QrCodeModal slug={qrSlug} shortUrl={`${baseUrl}/${qrSlug}`} onClose={() => setQrSlug(null)} />}
      
      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[var(--db-surface)] border-4 border-[var(--db-border)] p-6 shadow-[12px_12px_0px_0px_var(--db-text)]">
            <div className="flex items-center gap-3 text-red-600 mb-4 border-b-4 border-[var(--db-border)] pb-2">
                <Trash2 className="h-6 w-6"/>
                <h3 className="font-black text-xl uppercase text-[var(--db-text)]">Delete Link?</h3>
            </div>
            <p className="font-bold mb-6 text-[var(--db-text)]">/{pendingDelete.slug}</p>
            <div className="flex gap-2">
                <button onClick={() => setPendingDelete(null)} className="flex-1 py-3 font-bold border-2 border-[var(--db-border)] text-[var(--db-text)] hover:bg-[var(--db-bg)]">CANCEL</button>
                <button onClick={confirmDelete} disabled={deleteLoading} className="flex-1 py-3 font-bold bg-red-600 text-white border-2 border-[var(--db-border)] hover:shadow-[4px_4px_0px_0px_var(--db-border)] hover:-translate-y-1 transition-all">
                    {deleteLoading ? "..." : "DELETE"}
                </button>
            </div>
          </div>
        </div>
      )}

      {selectedLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-[var(--db-surface)] border-4 border-[var(--db-border)] p-6 shadow-[12px_12px_0px_0px_var(--db-text)]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-black text-lg uppercase text-[var(--db-text)]">Link Details</h3>
                    <button onClick={() => setSelectedLink(null)} className="border-2 border-[var(--db-border)] p-1 hover:bg-red-100 text-[var(--db-text)]"><X className="h-5 w-5"/></button>
                </div>
                <div className="bg-[var(--db-bg)] border-2 border-[var(--db-border)] p-4 font-mono text-xs break-all mb-4 text-[var(--db-text)]">
                    {selectedLink.targetUrl}
                </div>
                <div className="flex justify-end gap-2">
                    <a href={selectedLink.targetUrl} target="_blank" className="bg-[var(--db-primary)] text-[var(--db-primary-fg)] px-4 py-2 font-bold border-2 border-[var(--db-border)] hover:shadow-[4px_4px_0px_0px_var(--db-border)] flex gap-2">
                        OPEN <ExternalLink className="h-4 w-4"/>
                    </a>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
