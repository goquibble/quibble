import { redditMono, redditSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import AppSidebar from "@/components/app-sidebar";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
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
        <NextTopLoader color="var(--primary)" showSpinner={false} height={2} />
        <Providers>
          <Header />
          <main className="flex">
            <AppSidebar />
            {children}
          </main>
        </Providers>
        <Toaster
          position="bottom-center"
          closeButton={true}
          offset={10}
          mobileOffset={10}
          gap={10}
        />
      </body>
    </html>
  );
}
