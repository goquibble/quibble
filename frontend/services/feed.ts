import { API_ENDPOINTS } from "@/constants/api-endpoints";
import api from "@/lib/api";
import type { Feed } from "@/types/feed";

export async function getFeed(limit = 10, offset = 0): Promise<Feed> {
  const res = await api.get<Feed>(API_ENDPOINTS.FEED, {
    params: { limit, offset },
  });
  return res.data;
}
