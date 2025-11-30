// app/[slug]/page.tsx

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import SlugRedirector from "@/components/SlugRedirector";
import PasswordGuard from "@/components/PasswordGuard";
import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";
import geoip from "geoip-lite";

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

  if (link.expiresAt && new Date() > link.expiresAt) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-4">
        <div className="w-full max-w-md p-6 rounded-xl db-card db-card-pop text-center space-y-3 shadow-md border-red-200 bg-red-50 dark:bg-red-950/20">
          <h1 className="text-lg font-semibold text-red-600">Link Kadaluarsa</h1>
          <p className="text-sm db-muted">
            Tautan ini sudah melewati batas waktu aktifnya.
          </p>
        </div>
      </div>
    );
  }

  if (link.password) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-4">
        <div className="w-full max-w-md p-6 rounded-xl db-card db-card-pop shadow-md">
          <PasswordGuard slug={link.slug} />
        </div>
      </div>
    );
  }


  try {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    const ip = headersList.get("x-real-ip") || headersList.get("x-forwarded-for") || "127.0.0.1";
    const realIp = Array.isArray(ip) ? ip[0] : ip.split(',')[0];

    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    const geo = geoip.lookup(realIp);

    await prisma.click.create({
      data: {
        shortLinkId: link.id,
        browser: result.browser.name,
        os: result.os.name,
        device: result.device.type || "desktop",
        country: geo?.country,
        city: geo?.city,
        ip: realIp,
      },
    });
  } catch (error) {
    console.error("Gagal mencatat analytics:", error);
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <div className="w-full max-w-md p-6 rounded-xl db-card db-card-pop text-center space-y-4 shadow-md">
        <p className="text-xs db-muted">Redirecting shortlink</p>
        <h1 className="break-all text-sm font-medium">{link.targetUrl}</h1>
        <SlugRedirector target={link.targetUrl} delay={3} />
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
