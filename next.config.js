/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Disable type checking during production build for faster deployments
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  swcMinify: true,
}

module.exports = nextConfig