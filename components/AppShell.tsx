//components/AppShell.tsx

"use client";

import { usePathname } from "next/navigation";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/";
  
  const maxWidth = isLogin 
    ? "max-w-4xl" 
    : "w-full md:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl";

  return (
    <div
      className={`
        ${maxWidth} mx-auto
        p-4 sm:p-6 xl:p-8
        bg-[var(--db-surface)] 
        border-2 md:border-4 border-[var(--db-border)] 
        shadow-[6px_6px_0px_0px_var(--db-border)]
        md:shadow-[12px_12px_0px_0px_var(--db-border)]
        transition-all duration-300
        mb-24
      `}
    >
      {children}
    </div>
  );
}
