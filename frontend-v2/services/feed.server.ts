import { cookies } from "next/headers";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import api from "@/lib/api";
import type { Feed } from "@/types/feed";

export async function getFeedSSR(): Promise<Feed> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.get("sessionid")?.value ?? "";
  const res = await api.get<Feed>(API_ENDPOINTS.FEED, {
    headers: { cookie: `sessionid=${cookieHeader}` },
  });

  return res.data;
}
