import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@crmos360/ai', '@crmos360/db', '@crmos360/line', '@crmos360/shared'],
};

export default nextConfig;
