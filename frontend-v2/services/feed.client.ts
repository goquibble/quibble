import { API_ENDPOINTS } from "@/constants/api-endpoints";
import api from "@/lib/api";
import type { Feed } from "@/types/feed";

export async function getFeed(): Promise<Feed> {
  const res = await api.get<Feed>(API_ENDPOINTS.FEED);
  return res.data;
}
