import { API_ENDPOINTS } from "@/constants/api-endpoints";
import api from "@/lib/api";
import { tokenStore } from "@/lib/token-store";
import axios from "axios";

export async function refreshToken(): Promise<string | null> {
  try {
    // changing base url for this request
    const res = await axios.post(
      API_ENDPOINTS.AUTH_REFRESH,
      {},
      { withCredentials: true },
    );
    const token = res.data.access_token;
    if (token) {
      tokenStore.setAccessToken(token);
      return token;
    }
  } catch (error) {
    console.error("Failed to refresh token", error);
  }
  return null;
}

export async function logOutSession(): Promise<void> {
  try {
    await axios.post(API_ENDPOINTS.AUTH_LOGOUT, {}, { withCredentials: true });
  } catch (error) {
    console.error("Logout failed", error);
  } finally {
    tokenStore.clear();
    // Redirect to login page or reload
    window.location.href = "http://localhost:5173/log-in";
  }
}
