import { getApiUrl } from "@/lib/api-client";

export async function getQuiblet(name: string) {
  const res = await fetch(getApiUrl(`api/v1/quiblet?name=${name}`));

  if (!res.ok) {
    const errData = await res.json();
    throw errData;
  } else {
    return res.json();
  }
}
