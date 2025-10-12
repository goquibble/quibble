import { cookies } from "next/headers";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import api from "@/lib/api";
import type { Quiblet } from "@/types/quiblet";

export async function getQuibletSSR(name: string) {
  const cookieStore = await cookies();
  const filteredCookies = cookieStore
    .getAll()
    .filter((cookie) => ["sessionid", "profile_id"].includes(cookie.name));

  // map cookies to "name=value" format and join with "; "
  const cookieHeader = filteredCookies
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const res = await api.get<Quiblet>(API_ENDPOINTS.QUIBLET(name), {
    headers: { cookie: cookieHeader },
  });

  return res.data;
}
