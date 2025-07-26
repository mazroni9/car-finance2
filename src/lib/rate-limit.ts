import { LRUCache } from 'lru-cache';

interface RateLimitOptions {
  interval: number;
  uniqueTokenPerInterval: number;
}

interface RateLimitResult {
  check: (limit: number, token: string) => Promise<void>;
}

const requests = new Map<string, { count: number; timestamp: number }>();

// Clean up expired entries periodically to prevent memory leaks
function cleanupExpiredEntries() {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  
  for (const [key, value] of requests.entries()) {
    if (now - value.timestamp > windowMs) {
      requests.delete(key);
    }
  }
}

// Clean up every 5 minutes
setInterval(cleanupExpiredEntries, 5 * 60 * 1000);

export async function checkRateLimit(ip: string) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10; // max requests per minute

  // Clean up expired entries on each call (more frequent cleanup)
  if (requests.size > 1000) { // Only clean if map is getting large
    cleanupExpiredEntries();
  }

  const current = requests.get(ip) || { count: 0, timestamp: now };
  
  if (now - current.timestamp > windowMs) {
    requests.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  requests.set(ip, { count: current.count + 1, timestamp: current.timestamp });
  return true;
}

export function rateLimit(options: RateLimitOptions): RateLimitResult {
  const tokenCache = new LRUCache<string, number>({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000,
  });

  return {
    check: async (limit: number, token: string): Promise<void> => {
      const currentCount = tokenCache.get(token) || 0;
      const newCount = currentCount + 1;
      
      if (newCount > limit) {
        throw new Error('Rate limit exceeded');
      }

      tokenCache.set(token, newCount);
      return Promise.resolve();
    },
  };
} 