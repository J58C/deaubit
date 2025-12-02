//lib/theme-cookie.ts

export type Theme = "light" | "dark";

const THEME_COOKIE_NAME = "deaubit_theme";
const ONE_YEAR = 60 * 60 * 24 * 365;

function getDomainAttribute(): string {
  const appHost = process.env.NEXT_PUBLIC_APP_HOST || "localhost";
  
  if (appHost.includes("localhost")) return "";

  const parts = appHost.split(".");
  if (parts.length >= 2) {
    const rootDomain = parts.slice(-2).join(".");
    return `; domain=.${rootDomain}`; 
  }
  
  return "";
}

export function readThemeFromCookieOnClient(): Theme | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(
    new RegExp("(?:^|; )" + THEME_COOKIE_NAME + "=(dark|light)")
  );
  if (!match) return null;

  const value = match[1];
  if (value === "dark" || value === "light") return value;
  return null;
}

export function writeThemeCookie(theme: Theme) {
  if (typeof document === "undefined") return;

  const domainPart = getDomainAttribute();

  document.cookie =
    `${THEME_COOKIE_NAME}=${encodeURIComponent(theme)}` +
    `; path=/; max-age=${ONE_YEAR}; SameSite=Lax${domainPart}`;
}
