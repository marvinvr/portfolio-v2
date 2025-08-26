#!/usr/bin/env node

/**
 * Whoop Refresh Token Fetcher
 * 
 * This script helps you get a refresh token for the Whoop API.
 * Run this script and follow the prompts to authorize your app.
 * 
 * Prerequisites:
 * 1. Create a Whoop Developer App at https://developer-dashboard.whoop.com/
 * 2. Set redirect URI to: http://localhost:3064/callback
 * 3. Add your WHOOP_CLIENT_ID and WHOOP_CLIENT_SECRET to your .env file
 * 
 * Usage:
 * bun run whoop:token
 * or
 * node scripts/get-whoop-token.js
 */

import http from 'http';
import { URL } from 'url';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from 'redis';

const WHOOP_AUTH_URL = 'https://api.prod.whoop.com/oauth/oauth2/auth';
const WHOOP_TOKEN_URL = 'https://api.prod.whoop.com/oauth/oauth2/token';
const REDIRECT_URI = 'http://localhost:3064/callback';
const PORT = 3064;

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

// Check environment variables
const CLIENT_ID = process.env.WHOOP_CLIENT_ID;
const CLIENT_SECRET = process.env.WHOOP_CLIENT_SECRET;
const REDIS_URL = process.env.REDIS_URL;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ Missing required environment variables!');
  console.error('');
  console.error('Please add WHOOP_CLIENT_ID and WHOOP_CLIENT_SECRET to your .env file:');
  console.error('');
  console.error('WHOOP_CLIENT_ID=your_whoop_client_id_here');
  console.error('WHOOP_CLIENT_SECRET=your_whoop_client_secret_here');
  console.error('');
  console.error('Get these from: https://developer-dashboard.whoop.com/');
  process.exit(1);
}

// Setup Redis client if available
let redisClient = null;

async function storeTokenInRedis(refreshToken, accessToken, expiresIn) {
  if (!REDIS_URL) {
    console.log('ℹ️  REDIS_URL not configured, skipping Redis storage');
    return;
  }

  try {
    if (!redisClient) {
      redisClient = createClient({ url: REDIS_URL });
      redisClient.on('error', (err) => console.error('Redis Client Error:', err));
      await redisClient.connect();
    }

    // Store refresh token (no expiration)
    await redisClient.set('whoop:refresh_token', refreshToken);
    
    // Store access token with expiration (subtract 60 seconds as buffer)
    await redisClient.setEx('whoop:access_token', Math.max(expiresIn - 60, 1), accessToken);
    
    console.log('✅ Tokens stored in Redis successfully');
  } catch (error) {
    console.error('⚠️  Failed to store tokens in Redis:', error.message);
    console.log('   Tokens will need to be manually added to .env file');
  }
}

async function exchangeCodeForToken(code) {
  try {
    const response = await fetch(WHOOP_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: REDIRECT_URI
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token exchange failed: ${response.status} ${errorText}`);
    }

    const tokenData = await response.json();
    return tokenData;
  } catch (error) {
    console.error('❌ Failed to exchange code for token:', error.message);
    process.exit(1);
  }
}

// Create a simple HTTP server to catch the callback
function startCallbackServer() {
  return new Promise((resolve) => {
    const server = http.createServer(async (req, res) => {
      const url = new URL(req.url, `http://localhost:${PORT}`);
      
      if (url.pathname === '/callback') {
        const code = url.searchParams.get('code');
        const error = url.searchParams.get('error');
        
        if (error) {
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end(`<h1>Authorization Failed</h1><p>Error: ${error}</p>`);
          console.error('❌ Authorization failed:', error);
          process.exit(1);
        }
        
        if (code) {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <h1>✅ Authorization Successful!</h1>
            <p>You can close this tab now.</p>
            <p>Check your terminal for the refresh token.</p>
          `);
          
          console.log('✅ Authorization successful! Exchanging code for tokens...');
          
          const tokenData = await exchangeCodeForToken(code);
          
          console.log('');
          console.log('🔍 Full token response:');
          console.log(JSON.stringify(tokenData, null, 2));
          console.log('');
          
          // Store tokens in Redis if available
          await storeTokenInRedis(
            tokenData.refresh_token,
            tokenData.access_token,
            tokenData.expires_in
          );
          
          console.log('');
          console.log('🎉 SUCCESS! Here\'s your refresh token:');
          console.log('');
          console.log('─'.repeat(80));
          console.log('');
          
          if (!REDIS_URL) {
            console.log('');
            console.log('⚠️  Note: Without Redis, you\'ll need to update the .env file');
            console.log('   each time the refresh token changes.');
          } else {
            console.log('✅ Tokens have been stored in Redis');
            console.log('   The application will automatically manage token refresh.');
          }
          
          console.log('');
          console.log('🔧 Token details:');
          console.log(`   Access Token: ${tokenData.access_token?.substring(0, 20)}...`);
          console.log(`   Expires in: ${tokenData.expires_in} seconds`);
          console.log(`   Token type: ${tokenData.token_type}`);
          
          // Close Redis connection if it was established
          if (redisClient && redisClient.isOpen) {
            await redisClient.quit();
          }
          
          server.close();
          process.exit(0);
        }
      } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>Not Found</h1>');
      }
    });
    
    server.listen(PORT, () => {
      resolve(server);
    });
  });
}

async function main() {
  console.log('🏃‍♂️ Whoop Refresh Token Fetcher');
  console.log('');
  console.log('Starting callback server on http://localhost:3064...');
  
  await startCallbackServer();
  
  // Build authorization URL
  const authUrl = new URL(WHOOP_AUTH_URL);
  authUrl.searchParams.set('client_id', CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'read:recovery read:sleep read:workout read:cycles offline');
  authUrl.searchParams.set('state', 'token_fetch');
  
  console.log('');
  console.log('🔗 Open this URL in your browser to authorize:');
  console.log('');
  console.log(authUrl.toString());
  console.log('');
  console.log('👆 Click the link above or copy-paste it into your browser');
  console.log('');
  console.log('Waiting for authorization...');
}

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});