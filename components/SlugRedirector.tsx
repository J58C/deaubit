//components/SlugRedirector.tsx

"use client";

import { useEffect, useState } from "react";
import { ExternalLink, ArrowRight } from "lucide-react";

export default function SlugRedirector({ target, delay = 5 }: { target: string; delay?: number }) {
  const [timeLeft, setTimeLeft] = useState(delay);
  
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const progress = ((delay - timeLeft) / delay) * circumference;
  const strokeDashoffset = circumference - progress;

  useEffect(() => {
    if (!target) return;

    if (timeLeft <= 0) {
      window.location.href = target;
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 0.1));
    }, 100);

    return () => clearInterval(timer);
  }, [target, timeLeft]);

  return (
    <div className="flex flex-col items-center justify-center w-full py-4 animate-in fade-in duration-700">
      
      <div className="relative flex items-center justify-center mb-6 group">
        <div className="absolute inset-0 bg-[var(--db-accent)] blur-2xl opacity-20 rounded-full group-hover:opacity-30 transition-opacity" />
        
        <svg className="transform -rotate-90 w-28 h-28 relative z-10 drop-shadow-sm">
          <circle
            cx="56"
            cy="56"
            r={radius}
            stroke="var(--db-border)"
            strokeWidth="6"
            fill="var(--db-surface)"
            className="opacity-50"
          />

          <circle
            cx="56"
            cy="56"
            r={radius}
            stroke="var(--db-accent)"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-100 ease-linear"
          />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center flex-col z-20">
          <span className="text-3xl font-bold font-mono text-[var(--db-text)] tabular-nums tracking-tighter">
            {Math.ceil(timeLeft)}
          </span>
          <span className="text-[0.55rem] uppercase tracking-widest font-bold text-[var(--db-text-muted)] mt-[-2px]">
            SECONDS
          </span>
        </div>
      </div>

      <div className="text-center space-y-3 w-full max-w-xs mx-auto">
         <div className="flex items-center justify-center gap-2 text-sm font-medium animate-pulse text-[var(--db-text)]">
            <span>Mengalihkan halaman</span>
            <ArrowRight className="h-4 w-4" />
         </div>
         
         <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[var(--db-surface-muted)] border border-[var(--db-border)] text-xs text-[var(--db-text-muted)]">
           <ExternalLink className="h-3 w-3 shrink-0" />
           <span className="truncate max-w-[200px] font-mono opacity-80">
             {target}
           </span>
         </div>
      </div>

    </div>
  );
}
