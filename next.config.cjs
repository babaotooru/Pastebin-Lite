/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure for API routes only (frontend handled by Vite)
  // Next.js will still process the app directory but we'll use Vite for pages
  output: 'standalone',
  // Skip static optimization for pages since we're using Vite
  experimental: {
    outputFileTracingIncludes: {
      '/api/**': ['./lib/**', './middleware.ts'],
    },
  },
}

module.exports = nextConfig
