import AppSidebar from "@/components/app-sidebar/app-sidebar";
import Header from "@/components/header";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex">
        <AppSidebar />
        {children}
      </main>
    </>
  );
}
