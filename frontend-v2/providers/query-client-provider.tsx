"use client";
import {
  QueryClient,
  QueryClientProvider as ReactQueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

interface QueryClientProviderProps {
  children: React.ReactNode;
}

export default function QueryClientProvider({
  children,
}: QueryClientProviderProps) {
  return (
    <ReactQueryClientProvider client={queryClient}>
      {children}
    </ReactQueryClientProvider>
  );
}
