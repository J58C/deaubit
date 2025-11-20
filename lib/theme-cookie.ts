//lib/theme-cookie.ts

export type Theme = "light" | "dark";

const THEME_COOKIE_NAME = "deaubit_theme";
const ONE_YEAR = 60 * 60 * 24 * 365;

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

const ROOT_DOMAIN = getRootDomainFromEnv();

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

  let domainPart = "";
  if (ROOT_DOMAIN) {
    domainPart = `; domain=.${ROOT_DOMAIN}`;
  }

  document.cookie =
    `${THEME_COOKIE_NAME}=${encodeURIComponent(theme)}` +
    `; path=/; max-age=${ONE_YEAR}; SameSite=Lax${domainPart}`;
}
