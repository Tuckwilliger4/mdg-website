/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable export mode for CMS development (re-enable for deployment)
  // output: 'export',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
