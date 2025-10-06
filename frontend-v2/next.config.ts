import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        hostname: "localhost",
        port: "9000",
      },
    ],
  },
};

export default nextConfig;
