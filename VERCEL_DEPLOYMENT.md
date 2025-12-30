# Vercel Deployment Guide

## Issue: "Unexpected token 'A', "A server e"... is not valid JSON"

This error occurs when the API returns HTML (error page) instead of JSON. This guide fixes the deployment configuration.

## Solution

### 1. Build Configuration

Vercel needs to:
1. Build Next.js API routes first (creates serverless functions)
2. Build Vite frontend second (creates static files)
3. Route `/api/*` to Next.js functions
4. Route everything else to Vite's `index.html`

### 2. Current Configuration

- **vercel.json**: Configured to use Next.js framework and proper rewrites
- **package.json**: Has `build:all` script that builds both
- **next.config.cjs**: Configured for Vercel serverless compatibility

### 3. Environment Variables

Make sure these are set in Vercel Dashboard:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `NEXT_PUBLIC_APP_URL` (optional, auto-set by Vercel)

### 4. Deployment Steps

1. **Push to GitHub** (if using Git integration)
2. **Vercel will automatically:**
   - Detect Next.js (from `app/` directory)
   - Run `npm run build:all`
   - Deploy API routes as serverless functions
   - Deploy Vite build as static files

### 5. If Issues Persist

Check Vercel build logs for:
- Next.js build errors
- Missing environment variables
- API route compilation issues

The API service now includes better error handling to catch non-JSON responses.

