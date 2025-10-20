import { API_ENDPOINTS } from "@/constants/api-endpoints";
import api from "@/lib/api";
import type { Comment } from "@/types/comment";

export async function getComments(
  name: string,
  id: string,
  slug: string,
): Promise<Comment[]> {
  const url = API_ENDPOINTS.QUIBLET_QUIB_COMMENTS(name, id, slug);
  const res = await api.get<Comment[]>(url);

  return res.data;
}

export async function createComment(
  name: string,
  id: string,
  slug: string,
  data?: {
    content: string;
    parent_path?: string;
  },
): Promise<Comment> {
  const url = API_ENDPOINTS.QUIBLET_QUIB_COMMENTS(name, id, slug);
  const res = await api.post<Comment>(url, data);

  return res.data;
}
