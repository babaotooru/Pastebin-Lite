# Pastebin-Lite

A lightweight pastebin application built with Next.js, featuring time-based expiration (TTL) and view limits. Fully deployable on Vercel with persistent storage using Vercel KV (Redis-compatible).

## Features

- ✅ Create pastes with optional TTL (time-to-live) and maximum view limits
- ✅ Automatic expiration based on TTL or view count
- ✅ Safe HTML rendering (XSS protection)
- ✅ RESTful API with JSON responses
- ✅ Health check endpoint
- ✅ Deterministic time support for testing
- ✅ Serverless-compatible architecture
- ✅ Production-ready error handling

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Storage**: Vercel KV (Redis-compatible)
- **Deployment**: Vercel (serverless)

## Project Structure

```
.
├── app/
│   ├── api/
│   │   ├── pastes/
│   │   │   ├── route.ts          # POST /api/pastes
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET /api/pastes/:id
│   │   └── healthz/
│   │       └── route.ts          # GET /api/healthz
│   ├── p/
│   │   └── [id]/
│   │       ├── page.tsx           # GET /p/:id (HTML view)
│   │       └── not-found.tsx      # 404 page
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Home page (create paste UI)
├── lib/
│   ├── storage.ts                 # Storage layer (KV operations)
│   ├── validation.ts              # Request validation
│   └── utils.ts                   # Utility functions (HTML escaping)
└── README.md
```

## API Endpoints

### 1. Create Paste

**POST** `/api/pastes`

**Request Body:**
```json
{
  "content": "string (required)",
  "ttl_seconds": number (optional, ≥1),
  "max_views": number (optional, ≥1)
}
```

**Response (201):**
```json
{
  "id": "string",
  "url": "https://<domain>/p/:id"
}
```

**Error (400):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "content",
      "message": "content is required and must be a non-empty string"
    }
  ]
}
```

### 2. Fetch Paste

**GET** `/api/pastes/:id`

**Response (200):**
```json
{
  "content": "string",
  "remaining_views": number | null,
  "expires_at": "ISO string" | null
}
```

**Error (404):**
```json
{
  "error": "Paste not found or expired"
}
```

**Note**: Each successful fetch decrements `remaining_views` if `max_views` is set.

### 3. View Paste (HTML)

**GET** `/p/:id`

Returns an HTML page displaying the paste content. Viewing counts as a view (decrements `remaining_views`).

### 4. Health Check

**GET** `/api/healthz`

**Response (200):**
```json
{
  "status": "ok",
  "storage": "available",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Local Development

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Vercel KV database (or Redis instance for local testing)

### Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
   Create a `.env.local` file:
   ```env
   # Vercel KV Configuration
   KV_REST_API_URL=your_kv_rest_api_url
   KV_REST_API_TOKEN=your_kv_rest_api_token
   
   # Optional: Set app URL for production
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # Optional: Enable test mode for deterministic time
   # TEST_MODE=1
   ```

   **Getting Vercel KV credentials:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Create a new project or select an existing one
   - Navigate to Storage → Create Database → KV
   - Copy the `KV_REST_API_URL` and `KV_REST_API_TOKEN`

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Testing with Deterministic Time

To enable deterministic time for testing:

1. Set `TEST_MODE=1` in your environment variables
2. Include the `x-test-now-ms` header in requests:
   ```bash
   curl -H "x-test-now-ms: 1000000000000" http://localhost:3000/api/pastes/:id
   ```

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set environment variables in Vercel Dashboard:**
   - Go to your project settings
   - Add `KV_REST_API_URL` and `KV_REST_API_TOKEN`
   - Optionally set `NEXT_PUBLIC_APP_URL` to your production domain

### Option 2: Deploy via GitHub

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect Next.js

3. **Configure environment variables:**
   - In project settings, add:
     - `KV_REST_API_URL`
     - `KV_REST_API_TOKEN`
     - `NEXT_PUBLIC_APP_URL` (optional, auto-set by Vercel)

## Persistence Choice: Vercel KV

**Why Vercel KV?**

- **Serverless-compatible**: Works seamlessly with Vercel's serverless functions
- **Redis-compatible**: Familiar API, fast in-memory storage
- **Built-in TTL**: Native support for time-based expiration
- **Zero configuration**: Automatically configured when linked to a Vercel project
- **Scalable**: Handles high concurrency without issues
- **Cost-effective**: Generous free tier for small to medium applications

**Alternative Options:**
- **PostgreSQL**: Use Vercel Postgres for relational data (overkill for this use case)
- **Upstash Redis**: External Redis service compatible with Vercel
- **PlanetScale**: MySQL-compatible serverless database

For this application, Vercel KV is the optimal choice due to its simplicity, built-in TTL support, and seamless integration with Vercel deployments.

## Architecture Decisions

### 1. **No Global Mutable State**
All state is stored in Vercel KV. Serverless functions are stateless, ensuring correct behavior under concurrent requests.

### 2. **Atomic Operations**
View counting uses atomic Redis operations to prevent race conditions. The `getPaste` function atomically decrements views.

### 3. **TTL Handling**
- If both TTL and max_views are set, whichever triggers first wins
- TTL is enforced both at the Redis level (automatic expiry) and application level (for deterministic time testing)
- Expired pastes return 404

### 4. **Safe HTML Rendering**
Content is escaped using a custom `escapeHtml` function to prevent XSS attacks. Line breaks are preserved using CSS.

### 5. **Error Handling**
All API endpoints return proper JSON error responses with appropriate HTTP status codes (400, 404, 500).

## Example Usage

### Create a paste with TTL and max views:
```bash
curl -X POST http://localhost:3000/api/pastes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello, World!",
    "ttl_seconds": 3600,
    "max_views": 5
  }'
```

### Fetch paste data:
```bash
curl http://localhost:3000/api/pastes/<paste-id>
```

### View paste in browser:
Open `http://localhost:3000/p/<paste-id>` in your browser.

## License

MIT


