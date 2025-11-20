//components/ThemeToggle.tsx

"use client";

import { useState } from "react";
import { Moon, SunMedium } from "lucide-react";

type Theme = "light" | "dark";

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

function writeThemeCookie(theme: Theme) {
  if (typeof document === "undefined") return;

  document.cookie =
    `${THEME_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;

  let cookie =
    `${THEME_COOKIE_NAME}=${encodeURIComponent(theme)}` +
    `; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;

  if (ROOT_DOMAIN) {
    cookie += `; domain=.${ROOT_DOMAIN}`;
  }

  document.cookie = cookie;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(() => {
    if (typeof document === "undefined") return null;
    const isDark = document.documentElement.classList.contains("dark");
    return isDark ? "dark" : "light";
  });

  function setThemeEverywhere(newTheme: Theme) {
    if (typeof document === "undefined") return;

    const html = document.documentElement;

    if (newTheme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }

    try {
      window.localStorage.setItem("theme", newTheme);
    } catch {

    }

    writeThemeCookie(newTheme);
    setTheme(newTheme);
  }

  function toggleTheme() {
    if (theme === null) return;
    const next: Theme = theme === "dark" ? "light" : "dark";
    setThemeEverywhere(next);
  }

  const isDark = theme === "dark";
  const label = theme === null ? "…" : isDark ? "Dark" : "Light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="fixed right-4 top-4 z-40 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs shadow-sm backdrop-blur-sm border-(--db-border) bg-(--db-surface) text-(--db-text-muted) hover:shadow-md"
      disabled={theme === null}
    >
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[10px] text-amber-300 dark:bg-slate-100 dark:text-slate-900">
        {isDark ? <Moon className="h-3 w-3" /> : <SunMedium className="h-3 w-3" />}
      </span>
      <span className="hidden sm:inline">{label} mode</span>
    </button>
  );
}
