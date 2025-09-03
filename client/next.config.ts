import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ['icons.veryicon.com','lh3.googleusercontent.com','risheek-twitter-dev.s3.ap-south-1.amazonaws.com'],
  },
  devIndicators: {
    buildActivity: false,
  },
};

export default nextConfig;
