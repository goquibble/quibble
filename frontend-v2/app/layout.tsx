import type { Metadata } from "next";
import { redditMono, redditSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Quibble - Delve into real conversations.",
  description:
    "A respectful social platform for real conversations. Celebrate diversity, connect authentically, and join Quibble’s ad-free community.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "dark font-sans antialiased",
          redditSans.variable,
          redditMono.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}
