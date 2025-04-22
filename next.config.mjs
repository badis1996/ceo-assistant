/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  distDir: 'dist',
  trailingSlash: true,
  reactStrictMode: true,
  swcMinify: true,
}

if (process.env.NODE_ENV === 'development') {
  nextConfig.server = {
    port: 5000,
  }
}

export default nextConfig
