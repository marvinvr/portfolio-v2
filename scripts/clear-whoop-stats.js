#!/usr/bin/env node

/**
 * Clear Whoop Stats Script
 * 
 * This script clears the whoop:stats_cache Redis key
 * 
 * Usage:
 * node scripts/clear-whoop-stats.js
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from 'redis';

// Load .env file
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env');

try {
  const envFile = readFileSync(envPath, 'utf8');
  const envLines = envFile.split('\n');
  
  for (const line of envLines) {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      const value = valueParts.join('=');
      if (key && value && !process.env[key]) {
        process.env[key] = value;
      }
    }
  }
} catch (error) {
  console.log('ℹ️  No .env file found, using environment variables only');
}

const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
  console.error('❌ REDIS_URL not configured in environment variables');
  process.exit(1);
}

async function clearWhoopStats() {
  let redisClient = null;
  
  try {
    redisClient = createClient({ url: REDIS_URL });
    redisClient.on('error', (err) => console.error('Redis Client Error:', err));
    await redisClient.connect();
    
    console.log('🔍 Checking for whoop:stats_cache key...');
    
    // Check if the whoop:stats_cache key exists
    const cacheKey = 'whoop:stats_cache';
    const exists = await redisClient.exists(cacheKey);
    
    if (!exists) {
      console.log('✅ No whoop:stats_cache key found to clear');
      return;
    }
    
    console.log('🗑️  Found whoop:stats_cache key to delete');
    
    // Delete the whoop:stats_cache key
    const result = await redisClient.del(cacheKey);
    
    console.log(`✅ Successfully cleared whoop:stats_cache from Redis`);
    
  } catch (error) {
    console.error('❌ Failed to clear whoop stats:', error.message);
    process.exit(1);
  } finally {
    if (redisClient && redisClient.isOpen) {
      await redisClient.quit();
    }
  }
}

async function main() {
  console.log('🧹 Clear Whoop Stats');
  console.log('');
  
  await clearWhoopStats();
  
  console.log('');
  console.log('🎉 Done!');
}

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});