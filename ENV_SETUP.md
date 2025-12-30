# Environment Variables Setup

This document explains how to set up environment variables for Pastebin-Lite.

## Required Environment Variables

### `KV_REST_API_URL`
- **Description**: The REST API URL for your Vercel KV database
- **Format**: Starts with `https://` (e.g., `https://your-db.upstash.io`)
- **How to get it**:
  1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
  2. Navigate to your project → Storage → KV Database
  3. Copy the `KV_REST_API_URL` value
- **Used in**: `lib/storage.ts` for connecting to the KV database

### `KV_REST_API_TOKEN`
- **Description**: The authentication token for your Vercel KV database
- **Format**: Long alphanumeric string
- **How to get it**:
  1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
  2. Navigate to your project → Storage → KV Database
  3. Copy the `KV_REST_API_TOKEN` value
- **Used in**: `lib/storage.ts` for authenticating KV database requests

## Optional Environment Variables

### `NEXT_PUBLIC_APP_URL`
- **Description**: The public URL of your application
- **Format**: Full URL (e.g., `http://localhost:3000` or `https://yourdomain.com`)
- **Default**: Automatically uses `VERCEL_URL` if available, otherwise defaults to `http://localhost:3000`
- **Used in**: `lib/storage.ts` for generating paste URLs

### `TEST_MODE`
- **Description**: Enable test mode for deterministic time (useful for testing)
- **Format**: Set to `1` to enable, leave unset to disable
- **Used in**: `lib/storage.ts` for time-based testing

## Setup Instructions

1. **Create `.env.local` file** in the project root:
   ```env
   KV_REST_API_URL=https://your-kv-rest-api-url.upstash.io
   KV_REST_API_TOKEN=your-kv-rest-api-token-here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

2. **Replace placeholder values** with your actual credentials from Vercel Dashboard

3. **Restart the development server**:
   ```bash
   npm run dev
   ```

## Verification

To verify your environment variables are set correctly:

1. Check the health endpoint: `http://localhost:3000/api/healthz`
2. The response should show `"storage": "available"` if configured correctly

## Code References

Environment variables are used in the following files:

- `lib/storage.ts` - Main storage operations
- `app/api/healthz/route.ts` - Health check endpoint
- `app/api/pastes/route.ts` - Paste creation endpoint

## Security Notes

- **Never commit `.env.local`** to version control (it's already in `.gitignore`)
- **Keep your tokens secure** - don't share them publicly
- **Rotate tokens** if they're accidentally exposed

