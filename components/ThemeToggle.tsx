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

  document.cookie = `${THEME_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;

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
    } catch {}

    writeThemeCookie(newTheme);
    setTheme(newTheme);
  }

  function toggleTheme() {
    if (theme === null) return;
    const next: Theme = theme === "dark" ? "light" : "dark";
    setThemeEverywhere(next);
  }

  const isDark = theme === "dark";
  const label = theme === null ? "…" : isDark ? "DARK" : "LIGHT";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      disabled={theme === null}
      className={`
        fixed right-4 bottom-4 z-50 
        flex items-center gap-2 
        bg-white border-2 border-black px-3 py-2 
        shadow-[4px_4px_0px_0px_black] 
        hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_black] 
        active:translate-y-0 active:shadow-[2px_2px_0px_0px_black]
        transition-all 
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      <div className={`p-1.5 border-2 border-black ${isDark ? 'bg-black text-white' : 'bg-yellow-300 text-black'}`}>
        {isDark ? <Moon className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
      </div>
      <span className="font-black text-xs uppercase hidden sm:inline text-black">
        {label} MODE
      </span>
    </button>
  );
}
