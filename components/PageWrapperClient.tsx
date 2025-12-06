//components/PageWrapperClient.tsx

"use client";

import { usePathname } from "next/navigation";
import AppShell from "./AppShell";
import ThemeToggle from "./ThemeToggle";

export default function PageWrapperClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const isAuthPage = [
    "/", 
    "/login", 
    "/register", 
    "/verify", 
    "/forgot-password", 
    "/reset-password",
    "/account-deleted",
    "/admin/delete"
  ].includes(pathname);

  const isSlugPage =
    segments.length === 1 &&
    !["dash", "api", "login", "register", "verify", "forgot-password", "reset-password", "account-deleted", "admin"].includes(segments[0]);

  if (isSlugPage) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        {children}
      </div>
    );
  }

  if (isAuthPage) {
    return (
      <>
        <ThemeToggle />
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 pb-24 transition-all duration-300">
          {children}
        </div>
      </>
    );
  }

  return (
    <>
      <ThemeToggle />
      <div className="min-h-screen flex flex-col px-4 items-center md:items-start justify-start py-8 pb-28 transition-all duration-300">
        <AppShell>{children}</AppShell>
      </div>
    </>
  );
}
