import { redditMono, redditSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import AppSidebar from "@/components/app-sidebar/app-sidebar";
import Header from "@/components/header";
import { AuthDialogProvider } from "@/context/auth-dialog-context";
import AuthProvider from "@/providers/auth-provider";
import QueryClientProvider from "@/providers/query-client-provider";

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
        <QueryClientProvider>
          <AuthProvider>
            <AuthDialogProvider>
              <Header />
              <main className="flex">
                <AppSidebar />
                {children}
              </main>
            </AuthDialogProvider>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
