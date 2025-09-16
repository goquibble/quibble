import type { z } from "zod";
import { getApiUrl } from "@/lib/api-client";
import { getAuthHeaders } from "@/lib/auth";
import type { AuthFormSchema } from "@/schemas/auth";
import type { Nullable } from "@/types/generics";

export async function authenticate(
  mode: "login" | "signup",
  values: z.infer<typeof AuthFormSchema>,
  csrfToken: Nullable<string>,
): Promise<{ status: number }> {
  const res = await fetch(getApiUrl(`_allauth/browser/v1/auth/${mode}`), {
    method: "POST",
    credentials: "include",
    headers: getAuthHeaders({ csrfToken }),
    body: JSON.stringify({
      email: values.email,
      password: values.password,
    }),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw errData;
  } else {
    return { status: res.status };
  }
}

export async function logOutSession(csrfToken: Nullable<string>) {
  await fetch(getApiUrl("_allauth/browser/v1/auth/session"), {
    method: "DELETE",
    credentials: "include",
    headers: getAuthHeaders({ csrfToken }),
  });
}
