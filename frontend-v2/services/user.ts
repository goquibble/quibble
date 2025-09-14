import { getApiUrl } from "@/lib/api-client";
import { getAuthHeaders } from "@/lib/auth";
import type { Nullable } from "@/types/nullable";

export async function getUserProfiles(csrfToken: Nullable<string>) {
  const res = await fetch(getApiUrl("api/v1/user/profiles"), {
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
