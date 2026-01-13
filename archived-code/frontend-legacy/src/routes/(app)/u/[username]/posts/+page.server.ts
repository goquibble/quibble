import api from '$lib/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, params }) => {
  await parent();

  const { data, response, error } = await api.GET('/u/profiles/{username}/posts/', {
    params: { path: { username: params.username } }
  });

  if (response.ok && data) {
    return { posts: data };
  } else {
    console.error(error);
  }
};
