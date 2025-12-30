/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure for API routes only (frontend handled by Vite)
  // Next.js will still process the app directory but we'll use Vite for pages
  // Remove 'standalone' output for Vercel serverless compatibility
  typescript: {
    // Don't fail build on TypeScript errors during deployment
    // You can set this to false to enforce type checking
    ignoreBuildErrors: false,
  },
  eslint: {
    // Don't fail build on ESLint errors during deployment
    // You can set this to false to enforce linting
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
