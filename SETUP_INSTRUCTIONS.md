# Complete Setup Instructions

## ✅ Current Status

- ✅ Next.js server is running on http://localhost:3000
- ✅ `.env.local` file created
- ⚠️ Storage is unavailable (needs Vercel KV credentials)

## 📋 Step-by-Step Setup

### Step 1: Get Vercel KV Credentials

#### Method 1: Vercel Dashboard (Recommended - Free)

1. **Visit**: https://vercel.com/dashboard
2. **Sign in** or create a free account
3. **Create a new project** (or use existing):
   - Click "Add New" → "Project"
   - You can skip connecting a Git repo for now
   - Give it any name (e.g., "pastebin-test")
4. **Create KV Database**:
   - In your project dashboard, click the **Storage** tab
   - Click **Create Database**
   - Select **KV** (Key-Value)
   - Name it (e.g., "pastebin-kv")
   - Click **Create**
5. **Copy Credentials**:
   - You'll see two values:
     - `KV_REST_API_URL` (starts with `https://`)
     - `KV_REST_API_TOKEN` (long alphanumeric string)
   - Copy both values

#### Method 2: Upstash (Alternative - Also Free)

1. **Visit**: https://console.upstash.com/
2. **Sign up** for free account
3. **Create Database**:
   - Click "Create Database"
   - Choose "Global" or "Regional"
   - Name it (e.g., "pastebin-kv")
   - Click "Create"
4. **Get REST API**:
   - Click on your database
   - Go to "REST API" tab
   - Copy:
     - `UPSTASH_REDIS_REST_URL` → This is your `KV_REST_API_URL`
     - `UPSTASH_REDIS_REST_TOKEN` → This is your `KV_REST_API_TOKEN`

### Step 2: Update .env.local

1. **Open** `.env.local` in the project root
2. **Replace** the placeholder values:

```env
KV_REST_API_URL=https://your-actual-url.upstash.io
KV_REST_API_TOKEN=your-actual-token-here
```

**Important**: 
- Remove any quotes around the values
- No spaces before/after the `=` sign
- Make sure the URL starts with `https://`

### Step 3: Restart the Dev Server

1. **Stop the current server**: Press `Ctrl+C` in the terminal
2. **Start it again**:
   ```powershell
   npm run dev
   ```

### Step 4: Verify Setup

Test the health endpoint:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/healthz" -Method Get
```

**Expected output**:
```json
{
  "status": "ok",
  "storage": "available",  ← Should say "available" now
  "timestamp": "2024-..."
}
```

## 🧪 Testing the Application

### Option 1: Use the Test Script

Run the automated test script:

```powershell
.\test-api.ps1
```

This will test:
- Health check
- Create paste
- Fetch paste
- Validation errors

### Option 2: Manual Testing

#### Test 1: Create a Paste via Browser

1. Open: http://localhost:3000
2. Enter some text in the "Content" field
3. (Optional) Set TTL or Max Views
4. Click "Create Paste"
5. Copy the URL that appears

#### Test 2: View Paste

1. Open the URL from Test 1 (e.g., http://localhost:3000/p/abc123)
2. You should see your paste content
3. Notice the "Remaining views" counter decreases

#### Test 3: Test API Endpoints

**Create Paste (PowerShell)**:
```powershell
$body = @{
    content = "This is a test paste from API"
    ttl_seconds = 3600
    max_views = 3
} | ConvertTo-Json

$result = Invoke-RestMethod -Uri "http://localhost:3000/api/pastes" -Method Post -Body $body -ContentType "application/json"
Write-Host "Paste ID: $($result.id)"
Write-Host "Paste URL: $($result.url)"
```

**Fetch Paste**:
```powershell
$pasteId = "your-paste-id-here"
Invoke-RestMethod -Uri "http://localhost:3000/api/pastes/$pasteId" -Method Get
```

**Health Check**:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/healthz" -Method Get
```

#### Test 4: Test Expiry

Create a paste that expires in 5 seconds:

```powershell
$body = @{
    content = "This will expire in 5 seconds"
    ttl_seconds = 5
} | ConvertTo-Json

$result = Invoke-RestMethod -Uri "http://localhost:3000/api/pastes" -Method Post -Body $body -ContentType "application/json"
Write-Host "Paste URL: $($result.url)"
Write-Host "Wait 6 seconds, then try to access it - it should return 404"
```

#### Test 5: Test Max Views

Create a paste with max 2 views:

```powershell
$body = @{
    content = "This can only be viewed 2 times"
    max_views = 2
} | ConvertTo-Json

$result = Invoke-RestMethod -Uri "http://localhost:3000/api/pastes" -Method Post -Body $body -ContentType "application/json"
Write-Host "Paste URL: $($result.url)"
Write-Host "Access it 3 times - the 3rd time should return 404"
```

## 🔧 Troubleshooting

### Problem: Storage Still Unavailable After Setup

**Check**:
1. ✅ `.env.local` file exists in project root
2. ✅ Values are correct (no quotes, no spaces)
3. ✅ Server was restarted after updating `.env.local`
4. ✅ Credentials are from active KV database

**Test credentials manually**:
```powershell
# Check if .env.local is being read
Get-Content .env.local
```

### Problem: "Invalid credentials" error

- Verify you copied the entire token (it's usually very long)
- Make sure there are no extra spaces or line breaks
- Try regenerating credentials in Vercel/Upstash dashboard

### Problem: Port 3000 already in use

```powershell
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace <PID> with actual number)
taskkill /PID <PID> /F
```

Or use a different port:
```powershell
$env:PORT=3001; npm run dev
```

## ✅ Success Checklist

- [ ] Vercel KV database created
- [ ] `.env.local` updated with credentials
- [ ] Dev server restarted
- [ ] Health check shows `"storage": "available"`
- [ ] Can create pastes via browser
- [ ] Can view pastes at `/p/:id`
- [ ] API endpoints working
- [ ] TTL expiry works
- [ ] Max views works

## 🚀 Next Steps

Once everything is working:

1. **Deploy to Vercel**: See `README.md` for deployment instructions
2. **Customize**: Modify UI, add features, etc.
3. **Test thoroughly**: Try edge cases, concurrent requests, etc.

---

**Need Help?** Check:
- `README.md` - Full documentation
- `QUICK_START.md` - Quick reference
- `SETUP_GUIDE.md` - Detailed setup guide

