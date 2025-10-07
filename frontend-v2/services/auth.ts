import type { z } from "zod";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import api from "@/lib/api";
import type { AuthFormSchema, VerificationFormSchema } from "@/schemas/auth";

export async function authenticate(
  mode: "login" | "signup",
  values: z.infer<typeof AuthFormSchema>,
): Promise<{ status: number }> {
  const url =
    mode === "login" ? API_ENDPOINTS.AUTH.LOGIN : API_ENDPOINTS.AUTH.SIGNUP;
  const res = await api.post(url, values);
  return { status: res.status };
}

export async function logOutSession(): Promise<void> {
  await api.delete(API_ENDPOINTS.AUTH.LOGOUT_SESSION);
}

export async function verifySession(
  values: z.infer<typeof VerificationFormSchema>,
): Promise<void> {
  await api.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, values);
}
