/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['your-supabase-storage-url.supabase.co'],
  },
}

module.exports = nextConfig