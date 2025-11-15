"use client";

import { usePathname } from "next/navigation";
import AppShell from "./AppShell";

export default function PageWrapperClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const isLogin = pathname === "/login";
  const isDashboard = pathname === "/";
  const isSlugPage = segments.length === 1 && pathname !== "/" && pathname !== "/login" && !pathname.startsWith("/api");

  if (isSlugPage) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        {children}
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex px-4 ${
        isLogin
          ? "items-center justify-center py-6"
          : "items-start justify-center py-6 md:py-8"
      }`}
    >
      <AppShell>{children}</AppShell>
    </div>
  );
}
