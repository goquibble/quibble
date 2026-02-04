import { API_ENDPOINTS } from "@/constants/api-endpoints";
import api from "@/lib/api";
import type { UserProfile } from "@/types/user";

export async function getUserProfile(): Promise<UserProfile> {
  const res = await api.get<UserProfile>(API_ENDPOINTS.USER_ME_PROFILE);
  return res.data;
}

export async function getUserByUsername(
  username: string,
): Promise<UserProfile> {
  const res = await api.get<UserProfile>(
    API_ENDPOINTS.USER_BY_USERNAME(username),
  );
  return res.data;
}
