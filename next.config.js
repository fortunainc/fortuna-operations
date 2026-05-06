/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  eslint: {
    // Disable ESLint during builds for now
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript checking during builds for now
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;