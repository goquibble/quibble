import api from '$lib/api';
import type { paths } from '$lib/api';
import type { PageServerLoad } from './$types';

type PostQuery = paths['/posts/']['get']['parameters']['query'];

export const load: PageServerLoad = async ({ url }) => {
  const sort_param = url.searchParams.get('sort');
  const query: PostQuery = { sort: sort_param ?? 'best' } as PostQuery;

  const { data: posts } = await api.GET('/posts/', {
    params: { query }
  });

  return { posts };
};
