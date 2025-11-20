// app/[slug]/page.tsx

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import SlugRedirector from "@/components/SlugRedirector";

export const dynamic = "force-dynamic";

interface ShortRedirectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ShortRedirectPage({
  params,
}: ShortRedirectPageProps) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  const link = await prisma.shortLink.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
  });

  if (!link) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-4">
        <div className="w-full max-w-md p-6 rounded-xl db-card db-card-pop text-center space-y-3 shadow-md">
          <h1 className="text-lg font-semibold">Shortlink tidak ditemukan</h1>
          <p className="text-sm db-muted">
            Tautan singkat yang Anda akses tidak tersedia atau sudah dihapus.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <div className="w-full max-w-md p-6 rounded-xl db-card db-card-pop text-center space-y-4 shadow-md">
        <p className="text-xs db-muted">Redirecting shortlink</p>

        <h1 className="wrap-break-word text-sm font-medium">
          {link.targetUrl}
        </h1>

        <SlugRedirector target={link.targetUrl} delay={10} />

        <div className="flex items-center justify-center pt-1">
          <Link
            href={link.targetUrl}
            className="db-btn-primary inline-flex items-center justify-center gap-2 text-xs w-full sm:w-auto"
          >
            Buka sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
