//components/UserMenu.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, LogOut, ChevronDown, ShieldAlert, LayoutDashboard } from "lucide-react";

interface UserMenuProps { 
    username?: string; 
    role?: string; 
}

export default function UserMenu({ username = "User", role = "USER" }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isAdminPage = pathname?.startsWith("/admin");

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
        className={`flex items-center gap-3 pl-2 pr-4 py-2 border-2 border-[var(--db-border)] transition-colors ${
            isAdminPage 
            ? "bg-red-600 text-white hover:bg-red-700 hover:border-white"
            : "bg-[var(--db-surface)] hover:bg-[var(--db-accent)] hover:text-[var(--db-accent-fg)]"
        }`}
      >
        <div className={`h-8 w-8 flex items-center justify-center font-black text-sm border border-current ${
            isAdminPage ? "bg-white text-red-600" : "bg-[var(--db-text)] text-[var(--db-bg)]"
        }`}>
          {username.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col items-start leading-none hidden sm:flex">
          <span className="font-bold text-sm truncate max-w-[120px]">{username}</span>
          {role === "ADMIN" ? (
             <span className={`text-[10px] font-black px-1 border mt-0.5 ${
                 isAdminPage ? "bg-white text-red-600 border-red-600" : "bg-red-100 text-red-600 border-red-200"
             }`}>
                 {isAdminPage ? "ROOT" : "ADMIN"}
             </span>
          ) : (
             <span className="text-[10px] font-bold text-green-600 bg-green-100 px-1 border border-[var(--db-border)] mt-0.5">VERIFIED</span>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform border-2 p-0.5 ml-2 ${
            isOpen ? "rotate-180" : ""
        } ${isAdminPage ? "border-white bg-red-700" : "border-[var(--db-border)] bg-[var(--db-bg)]"}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-[var(--db-surface)] border-4 border-[var(--db-border)] shadow-[8px_8px_0px_0px_var(--db-border)] p-2 z-50 animate-in fade-in slide-in-from-top-2">
          
          <div className="px-2 py-2 mb-2 border-b-2 border-[var(--db-border)] sm:hidden">
             <span className="font-bold text-sm block truncate text-[var(--db-text)]">{username}</span>
          </div>
          
          {role === "ADMIN" && (
              isAdminPage ? (
                <Link
                    href="/dash"
                    className="flex items-center gap-3 px-3 py-3 font-black text-sm text-[var(--db-text)] bg-[var(--db-bg)] border-2 border-[var(--db-border)] hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_var(--db-border)] transition-all mb-2"
                    onClick={() => setIsOpen(false)}
                >
                    <LayoutDashboard className="h-4 w-4" /> 
                    <span>EXIT GOD MODE</span>
                </Link>
              ) : (
                <Link
                    href="/admin"
                    className="flex items-center gap-3 px-3 py-3 font-black text-sm text-white bg-red-600 border-2 border-[var(--db-border)] hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_var(--db-border)] transition-all mb-2"
                    onClick={() => setIsOpen(false)}
                >
                    <ShieldAlert className="h-4 w-4" /> 
                    <span>ADMIN DASHBOARD</span>
                </Link>
              )
          )}

          <Link
            href="/dash/settings"
            className="flex items-center gap-3 px-3 py-3 font-bold text-sm text-[var(--db-text)] hover:bg-[var(--db-bg)] hover:translate-x-1 transition-transform border-b-2 border-[var(--db-surface-muted)]"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="h-4 w-4" /> SETTINGS
          </Link>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 font-bold text-sm text-[var(--db-danger)] hover:bg-red-50 hover:translate-x-1 transition-transform"
          >
            <LogOut className="h-4 w-4" /> SIGN OUT
          </button>
        </div>
      )}
    </div>
  );
}
