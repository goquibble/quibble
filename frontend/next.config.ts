import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

function getRemotePattern(url?: string): RemotePattern | null {
  if (!url) return null;

  try {
    const u = new URL(url);
    return {
      protocol: u.protocol.includes("s") ? "https" : "http",
      hostname: u.hostname,
      port: u.port,
      pathname: "/**",
    };
  } catch {
    return null;
  }
}

const s3Urls = process.env.AWS_S3_ENDPOINT_URLS?.split(",") || [];
const avatarsUrl = process.env.AVATARS_API_URL;

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      ...s3Urls.map((url) => getRemotePattern(url.trim())),
      getRemotePattern(avatarsUrl),
    ].filter((p): p is RemotePattern => p !== null),
  },
};

export default nextConfig;
