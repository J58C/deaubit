//lib/rateLimit.ts

type RateLimitRecord = {
  count: number;
  expiresAt: number;
};

const globalStore = global as unknown as { 
  rateLimitMap: Map<string, RateLimitRecord>,
  cleanupInterval?: NodeJS.Timeout 
};

const rateLimitMap = globalStore.rateLimitMap || new Map<string, RateLimitRecord>();
if (process.env.NODE_ENV !== "production") globalStore.rateLimitMap = rateLimitMap;

const DEFAULT_WINDOW_MS = 60 * 60 * 1000;
const DEFAULT_LIMIT = 10;
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

if (!globalStore.cleanupInterval) {
  globalStore.cleanupInterval = setInterval(() => {
    const now = Date.now();
    let deleted = 0;
    
    rateLimitMap.forEach((value, key) => {
      if (now > value.expiresAt) {
        rateLimitMap.delete(key);
        deleted++;
      }
    });
    
    if (deleted > 0 && process.env.NODE_ENV === 'development') {
      console.log(`🧹 Rate Limit GC: Cleared ${deleted} expired records`);
    }
  }, CLEANUP_INTERVAL_MS);
  
  if (globalStore.cleanupInterval.unref) globalStore.cleanupInterval.unref();
}

export async function checkRateLimit(identifier: string, type: string = "general") {
  const key = `${type}:${identifier}`;
  const now = Date.now();
  
  const record = rateLimitMap.get(key);

  if (!record || now > record.expiresAt) {
    rateLimitMap.set(key, {
      count: 1,
      expiresAt: now + DEFAULT_WINDOW_MS,
    });
    return { ok: true };
  }

  if (record.count >= DEFAULT_LIMIT) {
    const retryAfter = Math.ceil((record.expiresAt - now) / 1000);
    return { ok: false, retryAfter };
  }

  record.count += 1;
  return { ok: true };
}
