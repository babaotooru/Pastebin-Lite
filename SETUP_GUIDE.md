# Vercel KV Setup Guide

## Quick Setup Steps

### Option 1: Using Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Sign in or create an account (free tier works)

2. **Create a KV Database**
   - Click on your project (or create a new one)
   - Navigate to the **Storage** tab
   - Click **Create Database**
   - Select **KV** (Key-Value store)
   - Give it a name (e.g., "pastebin-kv")
   - Click **Create**

3. **Get Your Credentials**
   - After creating, you'll see:
     - `KV_REST_API_URL` - Copy this value
     - `KV_REST_API_TOKEN` - Copy this value
   - These are displayed in the database settings

4. **Update .env.local**
   - Open `.env.local` in the project root
   - Replace the placeholder values:
     ```env
     KV_REST_API_URL=https://your-actual-url.upstash.io
     KV_REST_API_TOKEN=your-actual-token-here
     ```

5. **Restart the Dev Server**
   - Stop the current server (Ctrl+C)
   - Run `npm run dev` again

### Option 2: Using Upstash (Alternative)

If you prefer to use Upstash directly:

1. **Go to Upstash**
   - Visit: https://console.upstash.com/
   - Sign up for a free account

2. **Create a Redis Database**
   - Click **Create Database**
   - Select **Global** or **Regional**
   - Choose a name
   - Click **Create**

3. **Get REST API Credentials**
   - Go to your database
   - Click on **REST API** tab
   - Copy:
     - `UPSTASH_REDIS_REST_URL` → Use as `KV_REST_API_URL`
     - `UPSTASH_REDIS_REST_TOKEN` → Use as `KV_REST_API_TOKEN`

4. **Update .env.local**
   ```env
   KV_REST_API_URL=https://your-db.upstash.io
   KV_REST_API_TOKEN=your-token-here
   ```

## Testing Without Vercel KV (Local Development)

For local testing, you can use a local Redis instance:

1. **Install Redis locally**
   - Windows: Use WSL2 or Docker
   - Mac: `brew install redis`
   - Linux: `sudo apt-get install redis-server`

2. **Run Redis**
   ```bash
   redis-server
   ```

3. **Use Redis REST API wrapper** (requires additional setup)

**Note**: The easiest way is to use Vercel KV or Upstash as they provide REST API endpoints that work out of the box.

## Verify Setup

After setting up, test the health endpoint:

```bash
curl http://localhost:3000/api/healthz
```

Expected response:
```json
{
  "status": "ok",
  "storage": "available",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

If you see `"storage": "unavailable"`, check your credentials in `.env.local`.

