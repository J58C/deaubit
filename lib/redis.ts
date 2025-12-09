//lib/redis.ts

import Redis from "ioredis";

const getRedisUrl = () => process.env.KV_URL;

class MockRedis {
  async get(key: string) { return null; }
  async set(key: string, value: string, mode?: string, duration?: number) { return "OK"; }
  async del(key: string) { return 1; }
  async incr(key: string) { return 1; }
  async expire(key: string, seconds: number) { return 1; }
  async ttl(key: string) { return -1; }
}

const globalForRedis = global as unknown as { redis: Redis | MockRedis };

let redisInstance: Redis | MockRedis;

if (getRedisUrl()) {
  redisInstance = globalForRedis.redis || new Redis(getRedisUrl()!, {
    maxRetriesPerRequest: 3,
    connectTimeout: 10000,
  });
} else {
  if (process.env.NODE_ENV !== "production" && !globalForRedis.redis) {
     console.warn("⚠️  KV_URL missing. Redis features (Cache/RateLimit) disabled.");
  }
  redisInstance = globalForRedis.redis || new MockRedis();
}

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redisInstance;

export const redis = redisInstance as Redis;