//components/UserMenu.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Settings, LogOut, ChevronDown } from "lucide-react";

interface UserMenuProps { username?: string; }

export default function UserMenu({ username = "User" }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 pl-2 pr-4 py-2 bg-[var(--db-surface)] border-2 border-[var(--db-border)] hover:bg-[var(--db-accent)] hover:text-[var(--db-accent-fg)] transition-colors"
      >
        <div className="h-8 w-8 bg-[var(--db-text)] text-[var(--db-bg)] flex items-center justify-center font-black text-sm">
          {username.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col items-start leading-none hidden sm:flex">
          <span className="font-bold text-sm truncate max-w-[120px] text-[var(--db-text)]">{username}</span>
          <span className="text-[10px] font-bold text-green-600 bg-green-100 px-1 border border-[var(--db-border)] mt-0.5">VERIFIED</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform border-2 border-[var(--db-border)] p-0.5 bg-[var(--db-bg)] text-[var(--db-text)] ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[var(--db-surface)] border-4 border-[var(--db-border)] shadow-[8px_8px_0px_0px_var(--db-border)] p-2 z-50">
          <div className="px-2 py-2 mb-2 border-b-2 border-[var(--db-border)] sm:hidden">
             <span className="font-bold text-sm block truncate text-[var(--db-text)]">{username}</span>
          </div>
          <Link
            href="/dash/settings"
            className="flex items-center gap-3 px-3 py-3 font-bold text-sm text-[var(--db-text)] hover:bg-[var(--db-bg)] hover:translate-x-1 transition-transform border-b-2 border-[var(--db-surface-muted)]"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="h-4 w-4" /> SETTINGS
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 font-bold text-sm text-red-600 hover:bg-red-50 hover:translate-x-1 transition-transform"
          >
            <LogOut className="h-4 w-4" /> SIGN OUT
          </button>
        </div>
      )}
    </div>
  );
}
