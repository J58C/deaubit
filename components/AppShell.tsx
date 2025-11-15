//components/AppShell.tsx

"use client";

import { usePathname } from "next/navigation";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isLogin = pathname === "/login";
  const maxWidth = isLogin ? "max-w-3xl" : "max-w-5xl";

  return (
    <div
      className={`db-shell w-full ${maxWidth} mx-auto p-4 md:p-6 db-animate`}
    >
      {children}
    </div>
  );
}
