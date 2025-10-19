import { API_ENDPOINTS } from "@/constants/api-endpoints";
import api from "@/lib/api";
import type { Comment } from "@/types/comment";

export async function getComments(
  name: string,
  id: string,
  slug: string,
): Promise<Comment[]> {
  const res = await api.get<Comment[]>(
    API_ENDPOINTS.QUIBLET_QUIB_COMMENTS(name, id, slug),
  );
  return res.data;
}
