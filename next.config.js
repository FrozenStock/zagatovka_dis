/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['your-supabase-storage-url.supabase.co'],
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  }
}

module.exports = nextConfig