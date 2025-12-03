// lib/loginRateLimit.ts

import { redis } from "@/lib/redis";

const WINDOW_SECONDS = 60 * 15;
const MAX_ATTEMPTS = 5;

export async function isLoginBlocked(identifier: string) {
  const key = `login_attempts:${identifier}`;

  const attempts = await redis.get(key);
  const count = attempts ? parseInt(attempts) : 0;

  if (count >= MAX_ATTEMPTS) {
    const ttl = await redis.ttl(key);
    return { blocked: true as const, retryAfter: ttl };
  }

  return { blocked: false as const };
}

export async function registerFailedLogin(identifier: string) {
  const key = `login_attempts:${identifier}`;
  
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, WINDOW_SECONDS);
  }
}
