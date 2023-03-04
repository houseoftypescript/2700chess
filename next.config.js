/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,
  basePath: isProd ? '/2700chess' : undefined,
  assetPrefix: isProd ? '/2700chess/' : undefined,
  images: { domains: ['images.chesscomfiles.com'] },
};

module.exports = nextConfig;
