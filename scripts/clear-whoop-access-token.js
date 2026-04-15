#!/usr/bin/env node

/**
 * Clear Whoop Access Token Script
 *
 * This clears the persisted access token so the next request forces a refresh.
 *
 * Usage:
 * node scripts/clear-whoop-access-token.js
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

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

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not configured in environment variables');
  process.exit(1);
}

async function clearWhoopAccessToken() {
  const client = new pg.Client({ connectionString: DATABASE_URL });

  try {
    await client.connect();
    await client.query(
      `
        UPDATE whoop_oauth_tokens
        SET access_token = NULL,
            access_token_expires_at = NULL,
            updated_at = NOW()
        WHERE provider = $1
      `,
      ['whoop']
    );

    console.log('✅ Cleared persisted WHOOP access token');
  } catch (error) {
    console.error('❌ Failed to clear WHOOP access token:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

async function main() {
  console.log('🧹 Clear Whoop Access Token');
  console.log('');

  await clearWhoopAccessToken();
}

main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
