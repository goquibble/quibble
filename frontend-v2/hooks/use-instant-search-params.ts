import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useInstantSearchParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setSearchParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, value);

      // instant browser's URL update
      // and manual refersh
      window.history.pushState({}, "", `?${params.toString()}`);
      setTimeout(() => router.refresh(), 0);
    },
    [router, searchParams],
  );

  return [searchParams, setSearchParams] as const;
}
