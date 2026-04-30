/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["uuid", "@upstash/redis"],
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
