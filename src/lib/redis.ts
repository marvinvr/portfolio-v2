import { createClient } from 'redis';
import { REDIS_URL } from '$env/static/private';

let redisClient: ReturnType<typeof createClient> | null = null;

export async function getRedisClient() {
  if (!redisClient) {
    if (!REDIS_URL) {
      console.warn('REDIS_URL not configured, using in-memory fallback');
      // Return a mock client for local development without Redis
      return {
        isOpen: true,
        get: async () => null,
        set: async () => 'OK',
        setEx: async () => 'OK',
        del: async () => 1,
        quit: async () => 'OK'
      };
    }

    redisClient = createClient({
      url: REDIS_URL,
      socket: {
        reconnectStrategy: (retries: number) => {
          if (retries > 10) {
            console.error('Redis reconnection failed after 10 attempts');
            return null;
          }
          return Math.min(retries * 100, 3000);
        }
      }
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('Redis Client Connected');
    });

    await redisClient.connect();
  }

  return redisClient;
}

export async function closeRedisConnection() {
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
    redisClient = null;
  }
}

// Token management functions
export async function getWhoopRefreshToken(): Promise<string | null> {
  const client = await getRedisClient();
  return await client.get('whoop:refresh_token');
}

export async function setWhoopRefreshToken(token: string): Promise<void> {
  const client = await getRedisClient();
  await client.set('whoop:refresh_token', token);
}

export async function getWhoopAccessToken(): Promise<string | null> {
  const client = await getRedisClient();
  return await client.get('whoop:access_token');
}

export async function setWhoopAccessToken(token: string, expiresIn: number): Promise<void> {
  const client = await getRedisClient();
  // Set with expiration (subtract 60 seconds as buffer)
  await client.setEx('whoop:access_token', Math.max(expiresIn - 60, 1), token);
}

// Stats caching
export async function getCachedWhoopStats(): Promise<any | null> {
  const client = await getRedisClient();
  const cached = await client.get('whoop:stats_cache');
  return cached ? JSON.parse(cached) : null;
}

export async function setCachedWhoopStats(stats: any, ttlSeconds = 3600): Promise<void> {
  const client = await getRedisClient();
  await client.setEx('whoop:stats_cache', ttlSeconds, JSON.stringify(stats));
}