// src/lib/linksStore.ts
export interface ShortLink {
  id: string;        // slug
  targetUrl: string;
  createdAt: number; // timestamp
}

// penyimpanan sementara di memory (untuk dev/testing)
const links = new Map<string, ShortLink>();

function generateId() {
  return Math.random().toString(36).substring(2, 8);
}

export function getAllLinks(): ShortLink[] {
  return Array.from(links.values()).sort((a, b) => b.createdAt - a.createdAt);
}

export function getLink(id: string): ShortLink | null {
  return links.get(id) ?? null;
}

export function createLink(targetUrl: string, slug?: string): ShortLink {
  try {
    // validasi URL basic
    new URL(targetUrl);
  } catch {
    throw new Error("Invalid URL");
  }

  let id = (slug || "").trim();
  if (id) {
    // bersihkan slug
    id = id.replace(/[^a-zA-Z0-9-]/g, "");
    if (!id) throw new Error("Slug cannot be empty after cleaning");
    if (links.has(id)) throw new Error(`Slug "${id}" already exists`);
  } else {
    // auto generate id unik
    do {
      id = generateId();
    } while (links.has(id));
  }

  const link: ShortLink = {
    id,
    targetUrl,
    createdAt: Date.now(),
  };

  links.set(id, link);
  return link;
}

export function updateLink(id: string, targetUrl: string): ShortLink {
  const existing = links.get(id);
  if (!existing) throw new Error("Link not found");

  try {
    new URL(targetUrl);
  } catch {
    throw new Error("Invalid URL");
  }

  const updated: ShortLink = { ...existing, targetUrl };
  links.set(id, updated);
  return updated;
}

export function deleteLink(id: string): void {
  links.delete(id);
}
