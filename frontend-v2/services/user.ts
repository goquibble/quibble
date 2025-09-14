import { getAuthHeaders } from "@/lib/auth";
import type { Nullable } from "@/types/nullable";

export async function getUserProfiles(csrfToken: Nullable<string>) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/profiles`;
  const res = await fetch(url, {
    credentials: "include",
    headers: getAuthHeaders({ csrfToken }),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw errData;
  } else {
    return res.json();
  }
}
