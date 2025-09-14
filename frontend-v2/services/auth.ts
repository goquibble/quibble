import type { z } from "zod";
import { getAuthHeaders } from "@/lib/auth";
import type { AuthFormSchema } from "@/schemas/auth";
import type { Nullable } from "@/types/nullable";

export async function authenticate(
  mode: "login" | "signup",
  values: z.infer<typeof AuthFormSchema>,
  csrfToken: Nullable<string>,
): Promise<{ status: number }> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/_allauth/browser/v1/auth/${mode}`;
  const body: Record<typeof mode, Record<string, string>> = {
    login: { ...values },
    signup: {
      email: values.email,
      password: values.password,
    },
  };

  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: getAuthHeaders({ csrfToken }),
    body: JSON.stringify(body[mode]),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw errData;
  } else {
    return { status: res.status };
  }
}
