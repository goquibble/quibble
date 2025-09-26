import { getApiUrl } from "@/lib/api-client";
import type { Quiblet } from "@/types/quiblet";

export async function getQuiblet(name: string): Promise<Quiblet> {
  const res = await fetch(getApiUrl(`api/v1/quiblet?name=${name}`));

  if (!res.ok) {
    const errData = await res.json();
    throw errData;
  } else {
    return res.json();
  }
}
