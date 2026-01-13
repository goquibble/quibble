import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// https://gist.github.com/zentala/1e6f72438796d74531803cc3833c039c
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

export function formatDate(date: string): string {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function timeAgo(isoDateString: string): string {
  const now = new Date();
  const past = new Date(isoDateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const intervals = [
    { label: "yr", seconds: 31536000 },
    { label: "mo", seconds: 2592000 },
    { label: "d", seconds: 86400 },
    { label: "hr", seconds: 3600 },
    { label: "m", seconds: 60 },
    { label: "s", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count > 0) {
      return `${count}${interval.label} ago`;
    }
  }

  // fallback
  return "just now";
}

export function getAvatarUrl(
  seed?: string,
  format: "svg" | "png" = "png",
  options: {
    color?: string;
    expression?: string;
  } = {},
): string {
  const url = process.env.NEXT_PUBLIC_AVATARS_API_URL;
  const baseUrl = new URL(`${url}/1.x/avatar/${format}`);

  Object.entries(options).forEach(([key, value]) => {
    if (value) baseUrl.searchParams.set(key, value);
  });

  if (seed) baseUrl.searchParams.set("seed", seed);
  return baseUrl.toString();
}
