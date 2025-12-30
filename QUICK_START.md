# Quick Start Guide

## Step 1: Set Up Vercel KV

### Option A: Vercel Dashboard (Easiest)

1. **Go to**: https://vercel.com/dashboard
2. **Sign in** (or create free account)
3. **Create/Select Project** → Go to **Storage** tab
4. **Create Database** → Select **KV**
5. **Copy credentials**:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
6. **Update `.env.local`** with your credentials

### Option B: Upstash (Alternative)

1. **Go to**: https://console.upstash.com/
2. **Create Database** → Select **Redis**
3. **Get REST API** credentials
4. **Update `.env.local`**:
   ```env
   KV_REST_API_URL=<UPSTASH_REDIS_REST_URL>
   KV_REST_API_TOKEN=<UPSTASH_REDIS_REST_TOKEN>
   ```

## Step 2: Restart Dev Server

After updating `.env.local`:

```powershell
# Stop current server (Ctrl+C), then:
npm run dev
```

## Step 3: Test the Application

### Option A: Use Test Script

```powershell
.\test-api.ps1
```

### Option B: Manual Testing

#### 1. Health Check
```powershell
curl http://localhost:3000/api/healthz
```

Expected: `{"status":"ok","storage":"available",...}`

#### 2. Create a Paste

**Via Browser:**
- Open: http://localhost:3000
- Fill in the form and click "Create Paste"

**Via API:**
```powershell
$body = @{
    content = "Hello, World!"
    ttl_seconds = 3600
    max_views = 5
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/pastes" -Method Post -Body $body -ContentType "application/json"
```

#### 3. View Paste

**Via Browser:**
- Open the URL returned from step 2 (e.g., http://localhost:3000/p/abc123)

**Via API:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/pastes/<paste-id>" -Method Get
```

#### 4. Test Expiry

Create a paste with short TTL:
```powershell
$body = @{
    content = "This will expire soon"
    ttl_seconds = 5  # 5 seconds
} | ConvertTo-Json

$result = Invoke-RestMethod -Uri "http://localhost:3000/api/pastes" -Method Post -Body $body -ContentType "application/json"
Write-Host "Paste URL: $($result.url)"
Write-Host "Wait 6 seconds, then try to access it..."
```

## Troubleshooting

### Storage Unavailable (503)

**Problem**: Health check shows `"storage": "unavailable"`

**Solution**:
1. Check `.env.local` exists and has correct values
2. Verify credentials are correct (no extra spaces)
3. Restart dev server after updating `.env.local`

### Connection Errors

**Problem**: Cannot connect to KV database

**Solution**:
1. Verify `KV_REST_API_URL` starts with `https://`
2. Check `KV_REST_API_TOKEN` is complete
3. Test credentials in Vercel/Upstash dashboard

### Port Already in Use

**Problem**: Port 3000 is already in use

**Solution**:
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

## Next Steps

- ✅ Application is running
- ✅ Storage is configured
- ✅ Test endpoints working
- 🚀 Ready to deploy to Vercel!

For deployment, see `README.md` section "Deployment to Vercel"


