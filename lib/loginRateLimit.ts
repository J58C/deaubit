// lib/loginRateLimit.ts

type Attempt = {
  count: number;
  firstAttemptAt: number;
};

const WINDOW_MS = 60_000; // 1 menit
const MAX_ATTEMPTS = 3;

const attempts = new Map<string, Attempt>();

export function isLoginBlocked(key: string) {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry) {
    return { blocked: false as const };
  }

  const diff = now - entry.firstAttemptAt;

  if (diff > WINDOW_MS) {
    attempts.delete(key);
    return { blocked: false as const };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    const retryAfterMs = WINDOW_MS - diff;
    return { blocked: true as const, retryAfterMs };
  }

  return { blocked: false as const };
}

export function registerFailedLogin(key: string) {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry) {
    attempts.set(key, { count: 1, firstAttemptAt: now });
    return;
  }

  const diff = now - entry.firstAttemptAt;

  if (diff > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAttemptAt: now });
    return;
  }

  entry.count += 1;
}
