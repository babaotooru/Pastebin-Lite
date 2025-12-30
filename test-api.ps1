# Pastebin-Lite API Test Script
# Run this script to test all API endpoints

Write-Host "=== Pastebin-Lite API Tests ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "1. Testing Health Check (GET /api/healthz)..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3000/api/healthz" -Method Get
    Write-Host "   Status: $($health.status)" -ForegroundColor Green
    Write-Host "   Storage: $($health.storage)" -ForegroundColor $(if ($health.storage -eq "available") { "Green" } else { "Red" })
    Write-Host "   Timestamp: $($health.timestamp)" -ForegroundColor Gray
} catch {
    Write-Host "   Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 2: Create Paste
Write-Host "2. Testing Create Paste (POST /api/pastes)..." -ForegroundColor Yellow
try {
    $body = @{
        content = "Hello, World! This is a test paste."
        ttl_seconds = 3600
        max_views = 5
    } | ConvertTo-Json

    $create = Invoke-RestMethod -Uri "http://localhost:3000/api/pastes" -Method Post -Body $body -ContentType "application/json"
    Write-Host "   Success! Paste created:" -ForegroundColor Green
    Write-Host "   ID: $($create.id)" -ForegroundColor Cyan
    Write-Host "   URL: $($create.url)" -ForegroundColor Cyan
    
    $pasteId = $create.id
    Write-Host ""
    
    # Test 3: Fetch Paste
    Write-Host "3. Testing Fetch Paste (GET /api/pastes/$pasteId)..." -ForegroundColor Yellow
    try {
        $fetch = Invoke-RestMethod -Uri "http://localhost:3000/api/pastes/$pasteId" -Method Get
        Write-Host "   Content: $($fetch.content)" -ForegroundColor Green
        Write-Host "   Remaining Views: $($fetch.remaining_views)" -ForegroundColor Cyan
        Write-Host "   Expires At: $($fetch.expires_at)" -ForegroundColor Cyan
    } catch {
        Write-Host "   Error: $_" -ForegroundColor Red
    }
    Write-Host ""
    
    # Test 4: View Paste in Browser
    Write-Host "4. View Paste URL:" -ForegroundColor Yellow
    Write-Host "   $($create.url)" -ForegroundColor Cyan
    Write-Host "   (Open this in your browser)" -ForegroundColor Gray
    Write-Host ""
    
    # Test 5: Test Validation
    Write-Host "5. Testing Validation (Invalid Request)..." -ForegroundColor Yellow
    try {
        $invalidBody = @{
            content = ""
        } | ConvertTo-Json
        
        Invoke-RestMethod -Uri "http://localhost:3000/api/pastes" -Method Post -Body $invalidBody -ContentType "application/json" -ErrorAction Stop
    } catch {
        $errorResponse = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "   Validation Error (Expected): $($errorResponse.error)" -ForegroundColor Green
        if ($errorResponse.details) {
            foreach ($detail in $errorResponse.details) {
                Write-Host "   - $($detail.field): $($detail.message)" -ForegroundColor Gray
            }
        }
    }
    
} catch {
    Write-Host "   Error: $_" -ForegroundColor Red
    if ($_.Exception.Response.StatusCode -eq 503) {
        Write-Host "   Note: Storage is unavailable. Please configure Vercel KV in .env.local" -ForegroundColor Yellow
    }
}
Write-Host ""
Write-Host "=== Tests Complete ===" -ForegroundColor Cyan


