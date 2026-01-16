import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 90, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.kutubxona.uit.uz',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'kutubxona.uit.uz',
      },
      {
        protocol: 'https',
        hostname: 'uit.uz',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1010',
        pathname: '/uploads/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;

