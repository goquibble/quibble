import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { getApiUrl } from "@/lib/api-client";
import type { Nullable } from "@/types/generics";

async function fetchCsrftoken(): Promise<Nullable<string>> {
  // first check if token already in cookie
  const token = Cookies.get("csrftoken");
  if (token) {
    return token;
  }
  // fetch, so server can set new one in cookie
  await fetch(getApiUrl("api/v1/csrftoken"), {
    method: "GET",
    credentials: "include",
  });
  // after fetch, token should be set in cookie by server
  return Cookies.get("csrftoken") || null;
}

export function useCsrfToken(): Nullable<string> {
  const { data: csrfToken } = useQuery<Nullable<string>>({
    queryKey: ["csrftoken"],
    queryFn: () => fetchCsrftoken(),
  });

  // return cached version
  return csrfToken || null;
}
