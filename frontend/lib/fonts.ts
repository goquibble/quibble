import { Reddit_Mono, Reddit_Sans } from "next/font/google";

export const redditSans = Reddit_Sans({
  subsets: ["latin"],
  variable: "--font-reddit-sans",
});

export const redditMono = Reddit_Mono({
  subsets: ["latin"],
  variable: "--font-reddit-mono",
});
