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
  const maxWidth = isLogin ? "max-w-4xl" : "max-w-6xl";

  return (
    <div
      className={`
        w-full ${maxWidth} mx-auto
        p-4 sm:p-6 md:p-10       /* Padding responsive: lebih kecil di mobile */
        bg-[var(--db-surface)] 
        border-2 md:border-4 border-[var(--db-border)] /* Border tipis di mobile */
        shadow-[6px_6px_0px_0px_var(--db-border)]      /* Shadow lebih kecil di mobile */
        md:shadow-[12px_12px_0px_0px_var(--db-border)]
        transition-all duration-300
      `}
    >
      {children}
    </div>
  );
}
