"use client";

import { redditMono, redditSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppSidebar from "@/components/app-sidebar/app-sidebar";
import Header from "@/components/header";
import { AuthDialogProvider } from "@/context/auth-dialog-context";

// query client instance
const queryClient = new QueryClient();

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
        <QueryClientProvider client={queryClient}>
          <AuthDialogProvider>
            <Header />
            <main className="flex">
              <AppSidebar />
              {children}
            </main>
          </AuthDialogProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
