import api from '$lib/api';
import { CommentCreateSchema } from '$lib/features/comments/schemas';
import { CommentTreeBuilder } from '$lib/functions/comment';
import type { PageServerLoad } from './$types';
import { fail, error as raise_error, redirect, type Actions } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ params }) => {
  const [post, comments] = await Promise.all([
    await api.GET('/posts/{id}/', {
      params: {
        path: { id: params.id }
      }
    }),
    await api.GET('/posts/{id}/comments/', {
      params: {
        path: { id: params.id }
      }
    })
  ]);

  if (post.response.ok && post.data) {
    if (post.data.slug !== params.slug) {
      redirect(307, `/q/${params.name}/posts/${post.data.id}/${post.data.slug}/`);
    }

    // build comment free before sending to frontend
    const comment_tree_builder = new CommentTreeBuilder(comments.data);
    const comment_tree = comment_tree_builder.build();

    return { post: post.data, comments: comment_tree };
  } else {
    raise_error(post.response.status, post.error?.errors[0]?.detail);
  }
};

export const actions: Actions = {
  comment: async ({ request, params }) => {
    const form = await superValidate(request, zod(CommentCreateSchema));

    if (!form.valid) return fail(400, { form });

    const { data, error, response } = await api.POST('/posts/{id}/comments/', {
      headers: { Cookie: request.headers.get('Cookie') },
      body: { ...form.data },
      params: {
        path: { id: String(params.id) }
      }
    });

    if (response.ok && data) {
      return { form, comment: data };
    } else if (error) {
      console.log(error);
      return setError(form, 'content', String(error.errors[0]?.detail));
    }
  }
};
