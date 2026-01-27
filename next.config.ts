import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // Optimize performance
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Optimize fonts
  optimizeFonts: true,
};

export default nextConfig;
