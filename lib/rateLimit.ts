//lib/rateLimit.ts

import { redis } from "@/lib/redis";

const DEFAULT_WINDOW = 60 * 60; 
const DEFAULT_LIMIT = 10;

export async function checkRateLimit(identifier: string, type: string = "general") {
  const key = `rate_limit:${type}:${identifier}`;

  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, DEFAULT_WINDOW);
  }

  if (current > DEFAULT_LIMIT) {
    const ttl = await redis.ttl(key);
    return { ok: false, retryAfter: ttl };
  }

  return { ok: true };
}
