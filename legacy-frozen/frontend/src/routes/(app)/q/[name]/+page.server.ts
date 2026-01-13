import api from '$lib/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent }) => {
  await parent();

  const [posts, highlighted_posts] = await Promise.all([
    api.GET('/q/communities/{name}/posts/', {
      params: {
        path: { name: params.name }
      }
    }),
    api.GET('/q/communities/{name}/highlighted-posts/', {
      params: {
        path: { name: params.name }
      }
    })
  ]);

  if (posts.response.ok && posts.data && highlighted_posts.response && highlighted_posts.data) {
    return { posts: posts.data, highlighted_posts: highlighted_posts.data };
  } else {
    const errors = [posts.error, highlighted_posts.error].filter((error) => error);
    console.error(errors);
  }
};
