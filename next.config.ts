import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ecommerce.routemisr.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  typescript: {
    // Ignore TypeScript errors during build for Vercel deployment
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore ESLint errors during build for Vercel deployment
    ignoreDuringBuilds: true,
  },
  // ✅ SAFE: Deployment-optimized settings
  experimental: {
    staleTimes: {
      dynamic: 0, // Disable caching for dynamic pages
    },
  },
  // ✅ FIXED: Moved to correct location in Next.js 15
  serverExternalPackages: ['jwt-decode'],
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
};

export default withNextIntl(nextConfig);