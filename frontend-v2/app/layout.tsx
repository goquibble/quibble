import { redditMono, redditSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import type { Metadata } from "next";
import AppSidebar from "@/components/app-sidebar/app-sidebar";
import Header from "@/components/header/header";
import Providers from "@/providers/providers";

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
        <Providers>
          <Header />
          <main className="flex">
            <AppSidebar />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
