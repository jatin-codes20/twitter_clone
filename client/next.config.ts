import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ['icons.veryicon.com'],
  },
  devIndicators: {
    buildActivity: false,
  },
};

export default nextConfig;
