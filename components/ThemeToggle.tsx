"use client";

import { useEffect, useState } from "react";
import { Moon, SunMedium } from "lucide-react";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

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
      document.cookie =
        "deaubit_theme=" +
        newTheme +
        "; path=/; max-age=31536000; sameSite=Lax";
    } catch {}
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
      className="fixed right-4 top-4 z-40 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs shadow-sm backdrop-blur-sm border-[var(--db-border)] bg-[var(--db-surface)] text-[var(--db-text-muted)] hover:shadow-md"
      disabled={theme === null}
    >
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[10px] text-amber-300 dark:bg-slate-100 dark:text-slate-900">
        {isDark ? <Moon className="h-3 w-3" /> : <SunMedium className="h-3 w-3" />}
      </span>
      <span className="hidden sm:inline">{label} mode</span>
    </button>
  );
}
