/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000']
    }
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }]
  },
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false }
}

export default nextConfig
