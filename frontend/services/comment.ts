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
    parentPath?: string;
  },
): Promise<Comment> {
  const url = API_ENDPOINTS.QUIBLET_QUIB_COMMENTS(name, id, slug);
  const payload = data
    ? {
        content: data.content,
        parent_path: data.parentPath,
      }
    : undefined;

  const res = await api.post<Comment>(url, payload);
  return res.data;
}

export async function deleteComment(
  name: string,
  id: string,
  slug: string,
  commentId: number,
): Promise<void> {
  const url = API_ENDPOINTS.QUIBLET_QUIB_COMMENT(name, id, slug, commentId);
  await api.delete(url);
}
