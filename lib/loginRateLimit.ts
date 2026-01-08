//lib/loginRateLimit.ts

type LoginAttemptRecord = {
  count: number;
  expiresAt: number;
};

const globalForLogin = global as unknown as { loginMap: Map<string, LoginAttemptRecord> };
const loginMap = globalForLogin.loginMap || new Map<string, LoginAttemptRecord>();

if (process.env.NODE_ENV !== "production") globalForLogin.loginMap = loginMap;

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export async function isLoginBlocked(identifier: string) {
  const key = `login:${identifier}`;
  const now = Date.now();
  const record = loginMap.get(key);

  if (record && now < record.expiresAt && record.count >= MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((record.expiresAt - now) / 1000);
    return { blocked: true as const, retryAfter };
  }

  return { blocked: false as const };
}

export async function registerFailedLogin(identifier: string) {
  const key = `login:${identifier}`;
  const now = Date.now();
  const record = loginMap.get(key);

  if (!record || now > record.expiresAt) {
    loginMap.set(key, {
      count: 1,
      expiresAt: now + WINDOW_MS
    });
  } else {
    record.count += 1;
  }
}
