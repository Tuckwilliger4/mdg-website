/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only export for production builds, not for dev
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
