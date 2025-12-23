/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Optimize compilation
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Disable ESLint during builds to avoid config issues
  eslint: {
    ignoreDuringBuilds: true,
  },
  // SWC minification is enabled by default in Next.js 15+
  // No need to specify swcMinify (deprecated)
};

module.exports = nextConfig;

