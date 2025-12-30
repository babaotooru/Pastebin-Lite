# Route Structure

This document describes all the page routes in the Pastebin-Lite application.

## Main Routes

### `/` (Home Page)
- **File**: `app/page.tsx`
- **Purpose**: Create new pastes
- **Features**: 
  - Paste creation form
  - Time picker for TTL
  - Max views input
  - Redirects to `/p/:id` after creation

### `/p/[id]` (Paste View Page)
- **File**: `app/p/[id]/page.tsx`
- **Purpose**: View a paste
- **Features**:
  - Display paste content
  - Real-time view count and expiry timer
  - Share and copy buttons
  - Back button
  - Create New button

## Share Routes

All share buttons now navigate to dedicated page routes that handle the sharing process.

### `/share/[platform]` (Share Platform Page)
- **File**: `app/share/[platform]/page.tsx`
- **Purpose**: Handle sharing to specific platforms
- **Supported Platforms**:
  - `whatsapp` - Share to WhatsApp
  - `twitter` or `x` - Share to Twitter/X
  - `facebook` - Share to Facebook
  - `telegram` - Share to Telegram
  - `linkedin` - Share to LinkedIn
  - `reddit` - Share to Reddit
  - `email` - Share via Email
  - `sms` - Share via SMS

**Query Parameters**:
- `url` (required) - The URL to share
- `text` (optional) - Text to include with the share
- `title` (optional) - Title for the share

**Behavior**:
1. Opens in a new tab (when clicked from ShareButton)
2. Shows a loading/redirecting UI
3. Automatically opens the platform's share URL in a new tab
4. Redirects back to the previous page or home after sharing

### `/share/copy` (Copy Link Page)
- **File**: `app/share/copy/page.tsx`
- **Purpose**: Copy link to clipboard
- **Query Parameters**:
  - `url` (required) - The URL to copy

**Behavior**:
1. Opens in a new tab (when clicked from ShareButton)
2. Automatically copies the URL to clipboard
3. Shows success message
4. Redirects back to the previous page or home

## API Routes

### `/api/pastes` (POST)
- Create a new paste

### `/api/pastes/[id]` (GET)
- Fetch a paste (decrements view count)

### `/api/pastes/[id]/stats` (GET)
- Get paste stats without decrementing views (for real-time updates)

### `/api/healthz` (GET)
- Health check endpoint

## Navigation Flow

1. **User clicks Share button** → Opens share menu
2. **User selects platform** → Opens `/share/[platform]?url=...&text=...` in new tab
3. **Share page loads** → Shows platform icon and loading state
4. **Auto-redirect** → Opens platform's share URL in new tab
5. **Return** → Redirects back to previous page or home

## Benefits of Page Routes

✅ **Better UX**: Users see a loading state before sharing
✅ **Error Handling**: Can show errors if sharing fails
✅ **Analytics**: Can track which platforms are used most
✅ **SEO Friendly**: Each share option has its own URL
✅ **Bookmarkable**: Users can bookmark specific share pages
✅ **Shareable**: Share pages themselves can be shared

## Example URLs

```
/share/whatsapp?url=https://example.com/p/abc123&text=Check%20this%20out
/share/twitter?url=https://example.com/p/abc123&text=Check%20this%20out
/share/copy?url=https://example.com/p/abc123
```


