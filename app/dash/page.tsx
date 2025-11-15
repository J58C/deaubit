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

export default function DashboardPage() {
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [targetUrl, setTargetUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLink, setSelectedLink] = useState<ShortLink | null>(null);

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
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create");

      setTargetUrl("");
      setSlug("");
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
      <div className="w-full max-w-5xl mx-auto space-y-5">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-(--db-border-soft) pb-4">
          <div className="flex items-center gap-3">
            <DeauBitLogo size={38} />
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">
                DeauBit
              </span>
              <span className="db-muted">
                Self-hosted shortlink manager
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="db-badge hidden sm:inline-flex items-center gap-1">
              <span className="db-status-dot" />
              Admin session · JWT
            </div>
            <button
              onClick={handleLogout}
              className="db-btn-ghost inline-flex items-center gap-1"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </header>

        <section className="flex flex-wrap items-center justify-between gap-4 border-b border-(--db-border-soft) pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-(--db-accent-soft) text-(--db-accent)">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  d="M8.5 6.75A3.25 3.25 0 0 1 11.75 3.5h1.5A3.75 3.75 0 0 1 17 7.25v.5a3.25 3.25 0 0 1-3.25 3.25h-1.25"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.5 17.25A3.25 3.25 0 0 1 12.25 20.5h-1.5A3.75 3.75 0 0 1 7 16.75v-.5A3.25 3.25 0 0 1 10.25 13h1.25"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium">Shortlinks overview</p>
              <p className="db-muted">
                Buat, kelola, dan salin shortlink dari satu dashboard.
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="db-muted">Total links</p>
            <p className="text-lg font-semibold">{links.length}</p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <ExistingShortlinksCard
              links={links}
              loadingTable={loadingTable}
              baseUrl={baseUrl}
              getDomainLabel={getDomainLabel}
              onCopy={copyToClipboard}
              onDelete={requestDelete}
              onViewTarget={(link) => setSelectedLink(link)}
            />
          </div>

          <div className="md:col-span-4">
            <CreateShortlinkCard
              targetUrl={targetUrl}
              slug={slug}
              loading={loading}
              error={error}
              onSubmit={handleCreate}
              onChangeTarget={setTargetUrl}
              onChangeSlug={setSlug}
            />
          </div>
        </section>
      </div>

      {selectedLink && (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelectedLink(null)}
          />
          <div className="relative w-full max-w-lg db-card db-card-pop p-5 space-y-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex flex-col">
                <span className="text-xs font-semibold">
                  Full target URL
                </span>
                <span className="db-muted text-[0.7rem]">
                  {selectedLink.slug} · dibuat{" "}
                  {new Date(selectedLink.createdAt).toLocaleString()}
                </span>
              </div>
              <button
                type="button"
                className="db-btn-icon"
                onClick={() => setSelectedLink(null)}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="rounded-lg border border-(--db-border-soft) bg-(--db-surface-muted) px-3 py-2 text-left">
              <p className="font-mono text-[0.7rem] break-all">
                {selectedLink.targetUrl}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
              <button
                type="button"
                className="db-btn-ghost inline-flex items-center gap-1 text-[0.7rem]"
                onClick={() => copyToClipboard(selectedLink.targetUrl)}
              >
                Copy target URL
              </button>
              <a
                href={selectedLink.targetUrl}
                target="_blank"
                rel="noreferrer"
                className="db-btn-primary inline-flex items-center gap-1 text-[0.7rem]"
              >
                <ExternalLink className="h-3 w-3" />
                Buka di tab baru
              </a>
            </div>
          </div>
        </div>
      )}

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={cancelDelete}
          />
          <div className="relative w-full max-w-md db-card db-card-pop p-5 space-y-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-(--db-danger-soft) text-(--db-danger)">
                  <Trash2 className="h-3.5 w-3.5" />
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold">
                    Hapus shortlink?
                  </span>
                  <span className="db-muted text-[0.7rem]">
                    Tindakan ini tidak bisa dibatalkan.
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="db-btn-icon"
                onClick={cancelDelete}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="rounded-lg border border-(--db-border-soft) bg-(--db-surface-muted) px-3 py-2 text-left text-[0.7rem] space-y-1">
              <div>
                <span className="db-muted">Slug: </span>
                <span className="font-mono">{pendingDelete.slug}</span>
              </div>
              <div className="truncate">
                <span className="db-muted">Target: </span>
                <span className="font-mono break-all">
                  {pendingDelete.targetUrl}
                </span>
              </div>
            </div>

            {deleteError && (
              <p
                className="text-[0.7rem] rounded-lg border px-3 py-2"
                style={{
                  borderColor: "rgba(248, 113, 113, 0.5)",
                  backgroundColor: "var(--db-danger-soft)",
                }}
              >
                {deleteError}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
              <button
                type="button"
                className="db-btn-ghost inline-flex items-center gap-1 text-[0.7rem]"
                onClick={cancelDelete}
                disabled={deleteLoading}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="db-btn-danger inline-flex items-center gap-1 text-[0.7rem]"
              >
                {deleteLoading && (
                  <Loader2 className="h-3 w-3 animate-spin" />
                )}
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
