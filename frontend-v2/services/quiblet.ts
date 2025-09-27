import type { Data } from "@/components/dialogs/create-quiblet-dialog/create-quiblet-dialog";
import { getApiUrl } from "@/lib/api-client";
import { getAuthHeaders } from "@/lib/auth";
import type { Nullable } from "@/types/generics";
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

export async function createQuiblet(
  data: Data,
  csrfToken: Nullable<string>,
): Promise<{ name: string }> {
  const formData = new FormData();

  if (data.name) formData.append("name", data.name);
  if (data.description) formData.append("description", data.description);
  if (data.type) formData.append("type", data.type.toUpperCase());
  if (data.nsfw !== undefined) formData.append("nsfw", String(data.nsfw));
  if (data.avatar) formData.append("avatar", data.avatar);
  if (data.banner) formData.append("banner", data.banner);

  // let browser auto-set headers
  const { "Content-Type": _, ...headersWithoutContentType } = getAuthHeaders({
    csrfToken,
  });

  const res = await fetch(getApiUrl("api/v1/quiblet/"), {
    method: "POST",
    headers: headersWithoutContentType,
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json();
    throw errData;
  } else {
    return res.json();
  }
}
