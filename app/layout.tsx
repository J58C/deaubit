//app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import PageWrapperClient from "@/components/PageWrapperClient";
import Script from "next/script";
import { cookies } from "next/headers";
import { use } from "react";

export const metadata: Metadata = {
  title: "DeauBit · URL Shortener",
  description: "DeauBit - elegant self-hosted URL shortener by deauport.",
};

const THEME_COOKIE_NAME = "deaubit_theme";

function getRootDomainFromEnv(): string | null {
  const base = process.env.NEXT_PUBLIC_BASE_URL;
  if (!base) return null;

  try {
    const host = new URL(base).hostname;
    const parts = host.split(".");
    if (parts.length < 2) return host;
    return parts.slice(-2).join(".");
  } catch {
    return null;
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = use(cookies());
  const cookieTheme = cookieStore.get(THEME_COOKIE_NAME)?.value;

  const initialTheme =
    cookieTheme === "dark" || cookieTheme === "light"
      ? cookieTheme
      : undefined;

  const rootDomain = getRootDomainFromEnv();
  const cookieDomainPart = rootDomain ? `; domain=.${rootDomain}` : "";

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={initialTheme === "dark" ? "dark" : ""}
    >
      <head>
        <Script id="deau-theme-init" strategy="beforeInteractive">
          {`(function() {
            try {
              var themeCookieName = '${THEME_COOKIE_NAME}';

              // 1) Baca dari cookie (lintas subdomain, domain=.deauport.id)
              var cookieMatch = document.cookie.match(
                new RegExp('(?:^|; )' + themeCookieName + '=(dark|light)')
              );
              var cookieTheme = cookieMatch ? cookieMatch[1] : null;

              // 2) Fallback dari localStorage LAMA (kalau cookie belum ada)
              var stored = null;
              try {
                stored = window.localStorage.getItem('theme');
              } catch(e) {}

              var storedTheme = (stored === 'dark' || stored === 'light') ? stored : null;

              // 3) Fallback preferensi sistem
              var prefersDark = false;
              try {
                prefersDark = window.matchMedia &&
                  window.matchMedia('(prefers-color-scheme: dark)').matches;
              } catch(e) {}

              // PRIORITAS: cookie > localStorage > system
              var theme = cookieTheme || storedTheme || (prefersDark ? 'dark' : 'light');

              if (theme === 'dark') {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }

              // Mirror ke localStorage (tapi BUKAN sebagai sumber utama)
              try {
                window.localStorage.setItem('theme', theme);
              } catch(e) {}

              // Bersihkan cookie host-only lama (tanpa domain)
              document.cookie =
                themeCookieName + '=; path=/; max-age=0; SameSite=Lax';

              // Tulis cookie baru dengan domain dari NEXT_PUBLIC_BASE_URL (kalau ada)
              document.cookie =
                themeCookieName + '=' + theme +
                '; path=/; max-age=31536000; SameSite=Lax${cookieDomainPart}';
            } catch(e) {}
          })();`}
        </Script>
      </head>

      <body className="min-h-screen antialiased">
        <PageWrapperClient>{children}</PageWrapperClient>
      </body>
    </html>
  );
}
