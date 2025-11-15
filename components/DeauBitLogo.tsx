"use client";

type DeauBitLogoProps = {
  size?: number;
};

export default function DeauBitLogo({ size = 40 }: DeauBitLogoProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className="flex items-center justify-center"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        aria-hidden="true"
      >
        <defs>
          {/* gradient lembut, agak miring */}
          <linearGradient id="db-grad-main" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <radialGradient
            id="db-glow"
            cx="30%"
            cy="10%"
            r="70%"
          >
            <stop offset="0%" stopColor="rgba(248, 250, 252, 0.9)" />
            <stop offset="100%" stopColor="rgba(15, 23, 42, 0)" />
          </radialGradient>
        </defs>

        {/* lingkaran luar */}
        <circle
          cx="20"
          cy="20"
          r="19"
          fill="url(#db-grad-main)"
        />

        {/* glow halus di pojok kiri atas */}
        <circle
          cx="14"
          cy="10"
          r="12"
          fill="url(#db-glow)"
        />

        {/* “pil” miring di tengah, bikin logo lebih dinamis */}
        <rect
          x="10"
          y="14"
          width="20"
          height="12"
          rx="6"
          fill="rgba(15,23,42,0.88)"
          transform="rotate(-8 20 20)"
        />

        {/* inisial dB */}
        <text
          x="19"
          y="21.5"
          textAnchor="middle"
          fontSize="8.5"
          fontWeight="600"
          fill="#e5e7eb"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
        >
          d
        </text>
        <text
          x="25"
          y="23"
          textAnchor="middle"
          fontSize="9.5"
          fontWeight="700"
          fill="#f9fafb"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
        >
          B
        </text>
      </svg>
    </div>
  );
}
