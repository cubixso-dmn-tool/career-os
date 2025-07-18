import { createClient, RedisClientType } from 'redis';

class CacheManager {
  private client: RedisClientType | null = null;
  private isConnected = false;
  private hasLoggedError = false;

  async connect() {
    if (this.isConnected && this.client) {
      return this.client;
    }

    try {
      // For development, use in-memory store if Redis not available
      if (process.env.NODE_ENV === 'development' && !process.env.REDIS_URL) {
        if (!this.hasLoggedError) {
          console.log('📦 Redis not configured, using in-memory fallback for development');
          this.hasLoggedError = true;
        }
        return null;
      }

      this.client = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        socket: {
          connectTimeout: 5000, // 5 seconds timeout
          reconnectStrategy: false // Don't auto-reconnect in development
        }
      });

      this.client.on('error', (err) => {
        // Silently handle Redis errors in development
        if (process.env.NODE_ENV !== 'production') {
          // Only log once to avoid spam
          if (!this.hasLoggedError) {
            console.log('📦 Redis unavailable, using in-memory fallback for development');
            this.hasLoggedError = true;
          }
        } else {
          console.error('Redis Client Error:', err);
        }
        this.isConnected = false;
        this.client = null;
      });

      this.client.on('connect', () => {
        console.log('✅ Redis connected successfully');
        this.isConnected = true;
        this.hasLoggedError = false;
      });

      // Add connection timeout
      const connectPromise = this.client.connect();
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Redis connection timeout')), 3000);
      });
      
      await Promise.race([connectPromise, timeoutPromise]);
      return this.client;
    } catch (error) {
      // Silently handle connection failures in development
      if (process.env.NODE_ENV !== 'production') {
        if (!this.hasLoggedError) {
          console.log('📦 Redis unavailable, using in-memory fallback for development');
          this.hasLoggedError = true;
        }
      } else {
        console.error('❌ Redis connection failed, falling back to in-memory cache:', error);
      }
      this.client = null;
      this.isConnected = false;
      return null;
    }
  }

  async get(key: string): Promise<any> {
    try {
      const client = await this.connect();
      if (!client) return null;

      const value = await client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds: number = 300): Promise<boolean> {
    try {
      const client = await this.connect();
      if (!client) return false;

      await client.setEx(key, ttlSeconds, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      const client = await this.connect();
      if (!client) return false;

      await client.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  async invalidatePattern(pattern: string): Promise<boolean> {
    try {
      const client = await this.connect();
      if (!client) return false;

      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(keys);
      }
      return true;
    } catch (error) {
      console.error('Cache invalidate pattern error:', error);
      return false;
    }
  }

  // High-level caching methods for common use cases
  async cacheUserData(userId: number, data: any, ttl: number = 600): Promise<void> {
    await this.set(`user:${userId}`, data, ttl);
  }

  async getUserData(userId: number): Promise<any> {
    return await this.get(`user:${userId}`);
  }

  async cacheCourseData(courseId: number, data: any, ttl: number = 1800): Promise<void> {
    await this.set(`course:${courseId}`, data, ttl);
  }

  async getCourseData(courseId: number): Promise<any> {
    return await this.get(`course:${courseId}`);
  }

  async cacheAnalytics(key: string, data: any, ttl: number = 300): Promise<void> {
    await this.set(`analytics:${key}`, data, ttl);
  }

  async getAnalytics(key: string): Promise<any> {
    return await this.get(`analytics:${key}`);
  }

  async invalidateUserCache(userId: number): Promise<void> {
    await this.invalidatePattern(`user:${userId}*`);
  }

  async invalidateAnalyticsCache(): Promise<void> {
    await this.invalidatePattern(`analytics:*`);
  }
}

export const cache = new CacheManager();

// Cache middleware for Express routes
export function cacheMiddleware(ttl: number = 300) {
  return async (req: any, res: any, next: any) => {
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey = `route:${req.originalUrl}${req.user?.id ? `:user:${req.user.id}` : ''}`;
    
    try {
      const cachedData = await cache.get(cacheKey);
      if (cachedData) {
        return res.json(cachedData);
      }

      // Override res.json to cache the response
      const originalJson = res.json;
      res.json = function(body: any) {
        cache.set(cacheKey, body, ttl);
        return originalJson.call(this, body);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
}