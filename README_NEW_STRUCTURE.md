# Pastebin-Lite - Vite + React Router Structure

The project has been restructured to use Vite + React Router instead of Next.js.

## New Structure

```
pastebin-lite/
│
├── src/
│   ├── App.jsx                  # Main app with routing
│   ├── main.jsx                 # Vite entry point
│   │
│   ├── pages/
│   │   ├── Home.jsx             # Create paste
│   │   ├── Created.jsx          # After paste creation
│   │   ├── ViewPaste.jsx        # View paste
│   │   ├── Expired.jsx          # Expired page
│   │   ├── NotFound.jsx         # 404 page
│   │   └── ErrorPage.jsx        # Error page
│   │
│   ├── components/
│   │   ├── PasteForm.jsx
│   │   ├── PasteBox.jsx
│   │   ├── CopyButton.jsx
│   │   ├── ShareButton.jsx
│   │   ├── TimePicker.jsx
│   │   ├── ExpiresDate.jsx
│   │   ├── ExpiredMessage.jsx
│   │   ├── Toast.jsx
│   │   └── Layout.jsx
│   │
│   ├── services/
│   │   └── api.js               # API calls
│   │
│   ├── styles/
│   │   └── global.css
│   │
│   └── utils/
│       └── constants.js
│
├── app/                          # Next.js API routes (keep for backend)
│   └── api/
│
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Important Notes

- The **API routes** in `app/api/` are still Next.js routes and need to run separately
- The Vite dev server runs on port 5173 by default
- API calls are proxied to `http://localhost:3000` (configure in `vite.config.js`)
- You'll need to run both the Next.js API server and Vite dev server for full functionality

## Running Both Servers

1. **Terminal 1 - Next.js API:**
   ```bash
   npm run dev  # Runs on port 3000
   ```

2. **Terminal 2 - Vite Frontend:**
   ```bash
   npm run dev  # Runs on port 5173
   ```

Or use a process manager like `concurrently` to run both.

