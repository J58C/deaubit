import type { Metadata } from "next";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import PageWrapperClient from "@/components/PageWrapperClient";
import Script from "next/script";
import { cookies } from "next/headers";
import { use } from "react";

export const metadata: Metadata = {
  title: "DeauBit · URL Shortener",
  description: "DeauBit - elegant self-hosted URL shortener by deauport.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = use(cookies());
  const cookieTheme = cookieStore.get("deaubit_theme")?.value;

  const initialTheme =
    cookieTheme === "dark" || cookieTheme === "light"
      ? cookieTheme
      : undefined;

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
              // Try cookie first
              var cookieMatch = document.cookie.match(/(?:^|; )deaubit_theme=(dark|light)/);
              var cookieTheme = cookieMatch ? cookieMatch[1] : null;

              // Then localStorage
              var stored = localStorage.getItem('theme');

              // Then system
              var prefersDark = window.matchMedia &&
                window.matchMedia('(prefers-color-scheme: dark)').matches;

              var theme = stored || cookieTheme || (prefersDark ? 'dark' : 'light');

              if (theme === 'dark') {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }

              localStorage.setItem('theme', theme);
              document.cookie = 'deaubit_theme=' + theme + '; path=/; max-age=31536000; SameSite=Lax';
            } catch(e) {}
          })();`}
        </Script>
      </head>

      <body className="min-h-screen antialiased">
        <ThemeToggle />
        <PageWrapperClient>{children}</PageWrapperClient>
      </body>
    </html>
  );
}
