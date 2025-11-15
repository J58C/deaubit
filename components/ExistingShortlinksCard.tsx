//components/ExistingShortlinksCard.tsx

import { Eye, Copy, Trash2, Link2 } from "lucide-react";

export interface ShortLink {
  id: string;
  slug: string;
  targetUrl: string;
  createdAt: string;
}

interface ExistingShortlinksCardProps {
  links: ShortLink[];
  loadingTable: boolean;
  baseUrl: string;
  getDomainLabel: (url: string) => string;
  onCopy: (url: string) => void;
  onDelete: (slug: string) => void;
  onViewTarget: (link: ShortLink) => void;
}

export function ExistingShortlinksCard({
  links,
  loadingTable,
  baseUrl,
  getDomainLabel,
  onCopy,
  onDelete,
  onViewTarget,
}: ExistingShortlinksCardProps) {
  return (
    <div className="db-card h-full flex flex-col overflow-hidden text-xs">
      <div className="flex items-center justify-between border-b border-(--db-border-soft) px-3 py-2.5">
        <div>
          <h2 className="text-[0.8rem] font-semibold">Existing shortlinks</h2>
          <p className="db-muted">
            Klik short URL untuk membuka, atau copy untuk dibagikan.
          </p>
        </div>
        {loadingTable && <span className="db-muted">Loading…</span>}
      </div>

      <div className="max-h-72 overflow-auto flex-1">
        <table className="w-full">
          <thead>
            <tr className="border-b border-(--db-border-soft)">
              <th className="px-3 py-2 text-left font-semibold db-muted">
                Short URL
              </th>
              <th className="px-3 py-2 text-left font-semibold db-muted w-40">
                Target
              </th>
              <th className="px-3 py-2 text-right font-semibold db-muted">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {links.length === 0 && !loadingTable ? (
              <tr>
                <td colSpan={3} className="px-3 py-4 text-center db-muted">
                  Belum ada shortlink. Buat satu di panel kanan.
                </td>
              </tr>
            ) : (
              links.map((link, index) => {
                const shortUrl = `${baseUrl}/${link.slug}`;
                const domainLabel = getDomainLabel(link.targetUrl);

                return (
                  <tr
                    key={link.id}
                    className={`border-b border-(--db-border-soft) ${
                      index % 2 === 0
                        ? "bg-transparent"
                        : "bg-[rgba(148,163,184,0.04)]"
                    } db-row-hover`}
                  >
                    <td className="px-3 py-2 align-top">
                      <a
                        href={shortUrl}
                        className="inline-flex items-center gap-1 text-(--db-accent)"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Link2 className="h-3 w-3" />
                        <span className="truncate max-w-[200px]">
                          {shortUrl.replace(/^https?:\/\//, "")}
                        </span>
                      </a>
                    </td>

                    <td className="px-3 py-2 align-top">
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-[120px]">
                          {domainLabel}
                        </span>
                        <button
                          type="button"
                          onClick={() => onViewTarget(link)}
                          className="db-btn-icon"
                          title="Lihat target URL penuh"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>

                    <td className="px-3 py-2 align-top text-right whitespace-nowrap">
                      <button
                        onClick={() => onCopy(shortUrl)}
                        className="db-btn-ghost inline-flex items-center gap-1 mr-1"
                        style={{
                          fontSize: "0.7rem",
                          paddingInline: "0.6rem",
                        }}
                      >
                        <Copy className="h-3 w-3" />
                        Copy
                      </button>
                      <button
                        onClick={() => onDelete(link.slug)}
                        className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[0.7rem]"
                        style={{
                          border: `1px solid rgba(248,113,113,0.5)`,
                          backgroundColor: "var(--db-danger-soft)",
                          color: "var(--db-danger)",
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
