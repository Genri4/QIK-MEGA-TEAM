import type { NextConfig } from 'next'

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.webway.studio',
        pathname: '/**',
      },
    ],
  },
} satisfies NextConfig

export default nextConfig
