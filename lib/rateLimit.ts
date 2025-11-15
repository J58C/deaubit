// src/lib/rateLimit.ts

type AttemptInfo = {
  count: number;
  firstAttempt: number;
  blockedUntil?: number;
};

// in-memory store (cukup untuk single instance VPS kecil)
const attempts = new Map<string, AttemptInfo>();

// config rate limit
const WINDOW_MS = 10 * 60 * 1000;       // jendela 10 menit
const MAX_ATTEMPTS = 5;                 // max 5 percobaan gagal
const BLOCK_DURATION_MS = 15 * 60 * 1000; // blokir 15 menit

export function checkRateLimit(key: string): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const info = attempts.get(key);

  // masih dalam masa blokir
  if (info?.blockedUntil && now < info.blockedUntil) {
    const retryAfter = Math.ceil((info.blockedUntil - now) / 1000);
    return { ok: false, retryAfter };
  }

  // jendela baru
  if (!info || now - info.firstAttempt > WINDOW_MS) {
    attempts.set(key, { count: 0, firstAttempt: now });
    return { ok: true };
  }

  // sudah lewat batas percobaan → blokir
  if (info.count >= MAX_ATTEMPTS) {
    info.blockedUntil = now + BLOCK_DURATION_MS;
    attempts.set(key, info);
    const retryAfter = Math.ceil(BLOCK_DURATION_MS / 1000);
    return { ok: false, retryAfter };
  }

  return { ok: true };
}

export function recordFailedAttempt(key: string) {
  const now = Date.now();
  const info = attempts.get(key);

  if (!info || now - info.firstAttempt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAttempt: now });
  } else {
    info.count += 1;
    attempts.set(key, info);
  }
}

export function resetAttempts(key: string) {
  attempts.delete(key);
}
