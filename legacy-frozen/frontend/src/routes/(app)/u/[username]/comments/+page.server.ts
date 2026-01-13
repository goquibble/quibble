import api from '$lib/api';
import type { CommentOverview } from '$lib/types/comment';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, params }) => {
  await parent();

  const { data, response, error } = await api.GET('/u/profiles/{username}/comments/', {
    params: { path: { username: params.username } }
  });

  if (response.ok && data) {
    return { comments: data as unknown as CommentOverview[] };
  } else {
    console.error(error);
  }
};
