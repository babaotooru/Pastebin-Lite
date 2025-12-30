/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure for API routes only (frontend handled by Vite)
  // Next.js will still process the app directory but we'll use Vite for pages
  // Remove 'standalone' output for Vercel serverless compatibility
  typescript: {
    // Fix TypeScript errors properly instead of ignoring
    ignoreBuildErrors: false,
  },
  eslint: {
    // Ignore ESLint during builds to avoid config issues
    // Set to false if you want to enforce linting
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
