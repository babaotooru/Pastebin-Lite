/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure for API routes only (frontend handled by Vite)
  // Next.js will only process the app directory for API routes
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Explicitly disable Pages Router - only use App Router
  // This prevents Next.js from looking for pages/ directory
  distDir: '.next',
  // Only process files in app/ directory
  pageExtensions: ['ts', 'tsx'],
}

module.exports = nextConfig
