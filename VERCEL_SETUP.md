# Vercel Deployment Setup Guide

## ⚠️ Current Issue: Missing Environment Variables

Your Vercel deployment is missing the required Vercel KV environment variables. Follow these steps to fix it:

## Step-by-Step Setup

### 1. Go to Vercel Dashboard

1. Visit: https://vercel.com/dashboard
2. Sign in to your account
3. Select your project: **pastebin-lite-beta**

### 2. Create Vercel KV Database

1. In your project dashboard, click on the **Storage** tab
2. Click **Create Database**
3. Select **KV** (Key-Value store)
4. Give it a name (e.g., "pastebin-kv")
5. Click **Create**

### 3. Link the Database to Your Project

After creating the database:

1. You'll see a prompt to **Link** the database to your project
2. Click **Link** to connect it
3. This automatically adds the environment variables to your project

### 4. Verify Environment Variables

1. Go to your project **Settings**
2. Click on **Environment Variables**
3. Verify these variables exist:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`

### 5. Redeploy

After adding environment variables:

1. Go to the **Deployments** tab
2. Click the **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger a redeploy

## Alternative: Manual Environment Variable Setup

If the database linking didn't work automatically:

1. Go to your **KV Database** settings
2. Copy the following values:
   - `KV_REST_API_URL` (starts with `https://`)
   - `KV_REST_API_TOKEN` (long alphanumeric string)

3. Go to your **Project Settings** → **Environment Variables**
4. Add each variable:
   - **Name**: `KV_REST_API_URL`
   - **Value**: (paste the URL)
   - **Environment**: Production, Preview, Development (select all)
   - Click **Save**

   - **Name**: `KV_REST_API_TOKEN`
   - **Value**: (paste the token)
   - **Environment**: Production, Preview, Development (select all)
   - Click **Save**

5. **Redeploy** your application

## Quick Fix Commands

If you have Vercel CLI installed:

```bash
# Link KV database
vercel link
vercel env pull .env.local

# Or set manually
vercel env add KV_REST_API_URL production
vercel env add KV_REST_API_TOKEN production
```

## Verification

After redeploying, test your API:

```bash
curl https://pastebin-lite-beta.vercel.app/api/healthz
```

Expected response:
```json
{
  "status": "ok",
  "storage": "available",
  "timestamp": "..."
}
```

If `storage` is `"available"`, you're all set! ✅

## Troubleshooting

### Still getting 500 errors?

1. **Check environment variables are set**:
   - Go to Project Settings → Environment Variables
   - Ensure both `KV_REST_API_URL` and `KV_REST_API_TOKEN` exist
   - Make sure they're enabled for **Production** environment

2. **Redeploy after adding variables**:
   - Environment variables only apply to new deployments
   - You must redeploy after adding them

3. **Check KV database status**:
   - Go to Storage tab
   - Ensure the database is **Active**
   - Check if there are any usage limits exceeded

4. **Verify variable names**:
   - Must be exactly: `KV_REST_API_URL` and `KV_REST_API_TOKEN`
   - Case-sensitive, no extra spaces

## Need Help?

- Vercel Docs: https://vercel.com/docs/storage/vercel-kv
- Vercel Support: https://vercel.com/support


