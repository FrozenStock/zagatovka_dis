/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production'
  },
  swcMinify: true,
}

module.exports = nextConfig