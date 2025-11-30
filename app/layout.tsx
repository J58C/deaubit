//app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PageWrapperClient from "@/components/PageWrapperClient";
import Script from "next/script";
import { cookies } from "next/headers";
import { use } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      className={`${initialTheme === "dark" ? "dark" : ""} ${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <Script id="deau-theme-init" strategy="beforeInteractive">
          {`(function() {
            try {
              var themeCookieName = '${THEME_COOKIE_NAME}';

              // A. Baca dari cookie
              var cookieMatch = document.cookie.match(
                new RegExp('(?:^|; )' + themeCookieName + '=(dark|light)')
              );
              var cookieTheme = cookieMatch ? cookieMatch[1] : null;

              // B. Fallback localStorage
              var stored = null;
              try {
                stored = window.localStorage.getItem('theme');
              } catch(e) {}
              var storedTheme = (stored === 'dark' || stored === 'light') ? stored : null;

              // C. Fallback System Preference
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

              // Sinkronisasi cookie agar server tahu preference user
              try {
                // Hapus cookie lama (cleanup)
                document.cookie = themeCookieName + '=; path=/; max-age=0; SameSite=Lax';
                
                // Set cookie baru
                document.cookie =
                  themeCookieName + '=' + theme +
                  '; path=/; max-age=31536000; SameSite=Lax${cookieDomainPart}';
              } catch(e) {}
            } catch(e) {}
          })();`}
        </Script>
      </head>

      <body className="min-h-screen antialiased font-sans bg-[var(--db-bg)] text-[var(--db-text)] selection:bg-[var(--db-accent-soft)]">
        <PageWrapperClient>{children}</PageWrapperClient>
      </body>
    </html>
  );
}
