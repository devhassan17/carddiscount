/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd2liqplnt17rh6.cloudfront.net',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
};

module.exports = nextConfig;
