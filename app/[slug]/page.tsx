// app/[slug]/page.tsx

import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis"; 
import Link from "next/link";
import SlugRedirector from "@/components/SlugRedirector";
import PasswordGuard from "@/components/PasswordGuard";
import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";
import { lookup } from "fast-geoip";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface ShortRedirectPageProps { params: Promise<{ slug: string }>; }

export default async function ShortRedirectPage({ params }: ShortRedirectPageProps) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  
  let link: any = null;
  const cacheKey = `shortlink:${slug}`;
  const cachedData = await redis.get(cacheKey);
  
  if (cachedData) {
    const parsed = JSON.parse(cachedData);
    link = {
        ...parsed,
        expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null,
    };
  } else {
    link = await prisma.shortLink.findFirst({ where: { OR: [{ slug }, { id: slug }] } });
    if (link) {
        await redis.set(cacheKey, JSON.stringify(link), "EX", 3600);
    }
  }

  const ErrorCard = ({ title, msg }: { title: string, msg: string }) => (
    <div className="min-h-screen w-full flex items-center justify-center px-4 bg-[var(--db-bg)]">
      <div className="w-full max-w-md bg-[var(--db-surface)] border-4 border-[var(--db-border)] shadow-[12px_12px_0px_0px_var(--db-border)] p-8 text-center">
        <div className="inline-flex p-4 bg-[var(--db-danger)] border-4 border-[var(--db-border)] text-white mb-6 shadow-[4px_4px_0px_0px_var(--db-border)]">
            <AlertTriangle className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-black uppercase mb-2 text-[var(--db-text)] leading-none">{title}</h1>
        <p className="font-bold text-[var(--db-text-muted)] mb-8 border-t-2 border-b-2 border-[var(--db-border)] py-2">{msg}</p>
        <Link href="/" className="flex items-center justify-center gap-2 w-full bg-[var(--db-text)] text-[var(--db-bg)] border-4 border-[var(--db-border)] py-4 font-black uppercase hover:shadow-[4px_4px_0px_0px_var(--db-border)] hover:-translate-y-1 transition-all">
            <ArrowLeft className="h-5 w-5" /> GO HOME
        </Link>
      </div>
    </div>
  );

  if (!link) return <ErrorCard title="404" msg="LINK NOT FOUND" />;
  if (link.expiresAt && new Date() > link.expiresAt) return <ErrorCard title="OOPS" msg="LINK HAS EXPIRED" />;
  
  if (link.password) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-4 bg-[var(--db-bg)]">
        <div className="w-full max-w-md bg-[var(--db-surface)] border-4 border-[var(--db-border)] shadow-[12px_12px_0px_0px_var(--db-border)] p-8">
          <PasswordGuard slug={link.slug} />
        </div>
      </div>
    );
  }

  (async () => {
      try {
        const headersList = await headers();
        const userAgent = headersList.get("user-agent") || "";
        const ip = headersList.get("x-real-ip") || headersList.get("x-forwarded-for") || "127.0.0.1";
        const realIp = Array.isArray(ip) ? ip[0] : ip.split(',')[0];
        
        const referrer = headersList.get("referer") || "Direct / Unknown"; 

        const parser = new UAParser(userAgent);
        const result = parser.getResult();
        
        const geo = await lookup(realIp);
        
        await prisma.click.create({
          data: {
            shortLinkId: link.id,
            browser: result.browser.name,
            os: result.os.name,
            device: result.device.type || "desktop",
            country: geo?.country,
            city: geo?.city,
            ip: realIp,
            referrer: referrer,
          },
        });
      } catch (e) { console.error("Analytics Error:", e); }
  })();

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 bg-[var(--db-bg)]">
      <div className="w-full max-w-md bg-[var(--db-surface)] border-4 border-[var(--db-border)] shadow-[12px_12px_0px_0px_var(--db-border)] p-8 text-center">
        <h1 className="text-2xl font-black uppercase text-[var(--db-text)] mb-2">REDIRECTING...</h1>
        <div className="bg-[var(--db-bg)] border-2 border-[var(--db-border)] p-3 mb-6">
            <p className="font-mono font-bold text-[var(--db-text)] text-xs truncate">{link.targetUrl}</p>
        </div>
        
        <SlugRedirector target={link.targetUrl} delay={3} />
        
        <div className="mt-8">
            <Link href={link.targetUrl} className="block w-full bg-[var(--db-accent)] text-[var(--db-accent-fg)] border-2 border-[var(--db-border)] py-3 font-black text-sm hover:shadow-[4px_4px_0px_0px_var(--db-border)] hover:-translate-y-1 transition-all uppercase">
                Skip Wait
            </Link>
        </div>
      </div>
    </div>
  );
}
