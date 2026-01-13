import AuthDialogProvider from "./auth-dialog-provider";
import AuthProvider from "./auth-provider";
import QueryClientProvider from "./query-client-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider>
      <AuthProvider>
        <AuthDialogProvider>{children}</AuthDialogProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
