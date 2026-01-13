import { API_ENDPOINTS } from "@/constants/api-endpoints";
import api from "@/lib/api";
import { getAuthCookieHeader } from "@/lib/cookies.server";
import type { Quib } from "@/types/quib";

export async function getQuibSSR(name: string, id: string, slug: string) {
  const cookieHeader = await getAuthCookieHeader();
  const res = await api.get<Quib>(API_ENDPOINTS.QUIBLET_QUIB(name, id, slug), {
    headers: { cookie: cookieHeader },
  });

  return res.data;
}
