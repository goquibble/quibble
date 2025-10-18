import { API_ENDPOINTS } from "@/constants/api-endpoints";
import api from "@/lib/api";
import type { Quib } from "@/types/quib";

export async function getQuib(name: string, id: string, slug: string) {
  const res = await api.get<Quib>(API_ENDPOINTS.QUIB(name, id, slug));
  return res.data;
}
