# Troubleshooting Guide

## Common Errors and Solutions

### 1. `net::ERR_ABORTED 404 (Not Found)`

This error typically occurs when:
- Browser is trying to fetch a resource that doesn't exist
- Missing favicon or icon files
- Broken API routes
- Missing static assets

#### Solution:
1. **Clear browser cache** and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
2. **Clear Next.js cache**:
   ```bash
   Remove-Item -Recurse -Force .next
   npm run dev
   ```
3. **Check browser console** for the exact URL that's failing
4. **Verify all routes exist** in the `app` directory

### 2. Hydration Warnings

**Warning**: `Extra attributes from the server: suppresshydrationwarning, data-qb-installed`

This is caused by browser extensions (like password managers) adding attributes to the HTML.

#### Solution:
✅ **Already fixed** - Added `suppressHydrationWarning` to `<html>` and `<body>` tags in `app/layout.tsx`

### 3. 404 Page Not Found

If you're seeing the 404 page when you shouldn't:

1. **Check the URL** - Make sure you're accessing:
   - Home: `http://localhost:3000/`
   - Paste: `http://localhost:3000/p/[id]`

2. **Restart the dev server**:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

3. **Clear Next.js cache**:
   ```bash
   Remove-Item -Recurse -Force .next
   npm run dev
   ```

### 4. React DevTools Message

**Message**: "Download the React DevTools for a better development experience"

This is **not an error** - it's just a helpful message. You can:
- Install React DevTools browser extension (optional)
- Ignore it (it won't affect functionality)

### 5. Missing Environment Variables

**Error**: `Missing required environment variables KV_REST_API_URL and KV_REST_API_TOKEN`

#### Solution:
1. Create `.env.local` file in project root
2. Add your Vercel KV credentials:
   ```env
   KV_REST_API_URL=your_kv_rest_api_url
   KV_REST_API_TOKEN=your_kv_rest_api_token
   ```
3. Restart the dev server

### 6. Build Errors

If you get build errors:

1. **Delete node_modules and reinstall**:
   ```bash
   Remove-Item -Recurse -Force node_modules
   npm install
   ```

2. **Clear all caches**:
   ```bash
   Remove-Item -Recurse -Force .next
   Remove-Item -Recurse -Force node_modules
   npm install
   npm run dev
   ```

### 7. Port Already in Use

**Error**: `Port 3000 is already in use`

#### Solution:
```bash
# Option 1: Kill the process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Option 2: Use a different port
npm run dev -- -p 3001
```

## Quick Fixes

### Reset Everything
```bash
# Stop the server (Ctrl+C)
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules
npm install
npm run dev
```

### Check for Errors
```bash
# Run linter
npm run lint

# Check TypeScript
npx tsc --noEmit
```

## Still Having Issues?

1. Check the browser console for specific error messages
2. Check the terminal for server errors
3. Verify all files exist in the correct locations
4. Make sure environment variables are set correctly
5. Try accessing the app in an incognito/private window


