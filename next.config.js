/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-supabase-storage-url.supabase.co']
  },
  typescript: {
    // During development you can disable type checking to speed up builds
    ignoreBuildErrors: process.env.NODE_ENV === 'development'
  }
}

module.exports = nextConfig