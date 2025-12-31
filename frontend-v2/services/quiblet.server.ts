import { API_ENDPOINTS } from "@/constants/api-endpoints";
import api from "@/lib/api";
import { getAuthCookieHeader } from "@/lib/cookies.server";
import type { Quiblet } from "@/types/quiblet";

export async function getQuibletSSR(name: string) {
  const cookieHeader = await getAuthCookieHeader();
  const res = await api.get<Quiblet>(API_ENDPOINTS.QUIBLET(name), {
    headers: { cookie: cookieHeader },
  });

  return res.data;
}
