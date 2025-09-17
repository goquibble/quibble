import { getApiUrl } from "@/lib/api-client";

export async function getUserProfiles() {
  const res = await fetch(getApiUrl("api/v1/user/me/profiles"), {
    credentials: "include",
  });

  if (!res.ok) {
    const errData = await res.json();
    throw errData;
  } else {
    return res.json();
  }
}

export async function getUserProfile() {
  const res = await fetch(getApiUrl("api/v1/user/me/profile"), {
    credentials: "include",
  });

  if (!res.ok) {
    const errData = await res.json();
    throw errData;
  } else {
    return res.json();
  }
}
