import { getApiUrl } from "@/lib/api-client";
import type { Search } from "@/types/search";

export async function search(query: string): Promise<Search> {
  const res = await fetch(getApiUrl(`api/v1/search?name=${query}`));
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}
