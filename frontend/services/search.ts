import { API_ENDPOINTS } from "@/constants/api-endpoints";
import api from "@/lib/api";
import type { Search } from "@/types/search";

export async function search(query: string): Promise<Search> {
  const res = await api.get<Search>(API_ENDPOINTS.SEARCH(query));
  return res.data;
}
