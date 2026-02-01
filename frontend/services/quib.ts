import { API_ENDPOINTS } from "@/constants/api-endpoints";
import api from "@/lib/api";
import type { Quib } from "@/types/quib";

export async function getQuib(name: string, id: string, slug: string) {
  const res = await api.get<Quib>(API_ENDPOINTS.QUIBLET_QUIB(name, id, slug));
  return res.data;
}

export async function getQuibVote(name: string, id: string, slug: string) {
  const res = await api.get<number>(
    API_ENDPOINTS.QUIBLET_QUIB_VOTE(name, id, slug),
  );
  return res.data;
}

export async function deleteQuib(name: string, id: string, slug: string) {
  await api.delete(API_ENDPOINTS.QUIBLET_QUIB(name, id, slug));
}
