import api from "@/lib/api";
import type { Feed } from "@/types/feed";

export async function getFeed(): Promise<Feed> {
  const res = await api.get<Feed>("api/v1/feed");
  return res.data;
}
