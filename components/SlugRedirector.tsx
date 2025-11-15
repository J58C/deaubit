//components/SlugRedirector.tsx

"use client";

import { useEffect, useState, CSSProperties } from "react";

export default function SlugRedirector({ target, delay = 10 }: { target: string; delay?: number }) {
  const [remainingMs, setRemainingMs] = useState(delay * 1000);

  useEffect(() => {
    if (!target) return;
    const total = delay * 1000;
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const diff = now - start;
      const rest = Math.max(total - diff, 0);
      setRemainingMs(rest);

      if (diff >= total) {
        window.location.href = target;
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, delay]);

  const secondsLeft = Math.max(1, Math.ceil(remainingMs / 1000));
  const totalMs = delay * 1000;
  const progress = Math.min(100, ((totalMs - remainingMs) / totalMs) * 100);

  const barStyle: CSSProperties = {
    ["--db-progress" as string]: `${progress}%`,
  };

  return (
    <div className="flex flex-col items-center gap-2 text-xs w-full">
      <div className="inline-flex items-center gap-2">
        <div className="db-spinner" />
        <p className="db-muted">
          Mengalihkan dalam <span className="font-semibold">{secondsLeft}</span> detik...
        </p>
      </div>
      <div className="db-progress-track w-full max-w-sm">
        <div className="db-progress-bar" style={barStyle} />
      </div>
    </div>
  );
}
