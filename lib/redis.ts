//lib/redis.ts

import Redis from "ioredis";

const getRedisUrl = () => {
  if (process.env.KV_URL) {
    return process.env.KV_URL;
  }
  throw new Error("KV_URL is not defined in .env");
};

const globalForRedis = global as unknown as { redis: Redis };

export const redis =
  globalForRedis.redis ||
  new Redis(getRedisUrl(), {
    maxRetriesPerRequest: 3,
    connectTimeout: 10000,
  });

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;