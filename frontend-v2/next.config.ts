import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

function getRemotePattern(url?: string): RemotePattern {
  if (!url) throw new Error(`Not a valid URL: ${url}`);

  const u = new URL(url);
  return {
    protocol: u.protocol.includes("s") ? "https" : "http",
    hostname: u.hostname,
    port: u.port,
    pathname: "/**",
  };
}

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      getRemotePattern(process.env.AWS_S3_ENDPOINT_URL),
      getRemotePattern(process.env.AVATARS_API_URL),
    ],
  },
};

export default nextConfig;
