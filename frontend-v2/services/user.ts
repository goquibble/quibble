import { API_ENDPOINTS } from "@/constants/api-endpoints";
import api from "@/lib/api";
import type { UserProfile } from "@/types/user";

export async function getUserProfiles(): Promise<UserProfile[]> {
  const res = await api.get<UserProfile[]>(API_ENDPOINTS.USER.ME_PROFILES);
  return res.data;
}

export async function getUserProfile(): Promise<UserProfile> {
  const res = await api.get<UserProfile>(API_ENDPOINTS.USER.ME_PROFILE);
  return res.data;
}
