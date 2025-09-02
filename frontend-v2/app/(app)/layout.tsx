import AppSidebar from "@/components/app-sidebar/app-sidebar";
import Header from "@/components/header";
import { AuthDialogProvider } from "@/context/auth-dialog-context";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthDialogProvider>
      <Header />
      <main className="flex">
        <AppSidebar />
        {children}
      </main>
    </AuthDialogProvider>
  );
}
