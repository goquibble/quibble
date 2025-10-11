import type { Data } from "@/components/dialogs/create-quiblet-dialog/create-quiblet-dialog";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import api from "@/lib/api";
import type { HighlightedQuib, Quib } from "@/types/quib";
import type { Quiblet } from "@/types/quiblet";

export async function getQuiblet(name: string) {
  const res = await api.get<Quiblet>(API_ENDPOINTS.QUIBLET(name));
  return res.data;
}

export async function getQuibletHighlights(name: string) {
  const res = await api.get<Array<HighlightedQuib>>(
    API_ENDPOINTS.QUIBLET_HIGHLIGHTS(name),
  );
  return res.data;
}

export async function getQuibletQuibs(name: string) {
  const res = await api.get<Array<Quib>>(API_ENDPOINTS.QUIBLET_QUIBS(name));
  return res.data;
}

export async function createQuiblet(data: Data): Promise<{ name: string }> {
  if (!data.name || !data.description || !data.type) {
    throw new Error();
  }

  // formdata for including files
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("type", data.type.toUpperCase());
  if (data.nsfw !== undefined) formData.append("nsfw", String(data.nsfw));
  if (data.avatar) formData.append("avatar", data.avatar);
  if (data.banner) formData.append("banner", data.banner);

  const res = await api.post(API_ENDPOINTS.QUIBLET(), formData);
  return res.data;
}
