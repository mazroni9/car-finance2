import { LRUCache } from 'lru-cache';

interface RateLimitOptions {
  interval: number;
  uniqueTokenPerInterval: number;
}

interface RateLimitResult {
  check: (limit: number, token: string) => Promise<void>;
}

const rateLimit = new Map<string, { count: number; timestamp: number }>();

export async function checkRateLimit(ip: string) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10; // max requests per minute

  const current = rateLimit.get(ip) || { count: 0, timestamp: now };
  
  if (now - current.timestamp > windowMs) {
    rateLimit.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  rateLimit.set(ip, { count: current.count + 1, timestamp: current.timestamp });
  return true;
}

export function rateLimit(options: RateLimitOptions): RateLimitResult {
  const tokenCache = new LRUCache({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000,
  });

  return {
    check: async (limit: number, token: string): Promise<void> => {
      const tokenCount = (tokenCache.get(token) as number[]) || [0];
      if (tokenCount[0] === 0) {
        tokenCache.set(token, tokenCount);
      }
      tokenCount[0] += 1;

      const currentUsage = tokenCount[0];
      if (currentUsage > limit) {
        throw new Error('Rate limit exceeded');
      }

      return Promise.resolve();
    },
  };
} 