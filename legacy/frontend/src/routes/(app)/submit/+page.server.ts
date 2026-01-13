import api from '$lib/api';
import { create_form_data, type FormDataObject } from '$lib/functions/form';
import { PostSubmitSchema } from '$lib/schemas/post-submit';
import type { PageServerLoad } from '../$types';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { setError, superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async () => {
  const form = await superValidate(zod(PostSubmitSchema));

  return { form };
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const form = await superValidate(request, zod(PostSubmitSchema));

    if (!form.valid) {
      return fail(400, withFiles({ form }));
    }

    const { data, response, error } = await api.POST('/posts/', {
      headers: { Cookie: request.headers.get('Cookie') },
      // @ts-expect-error: needs cover field in File type
      body: {
        ...form.data,
        poster: Number(cookies.get('profile-id'))
      },
      bodySerializer(body) {
        return create_form_data(body as unknown as FormDataObject);
      }
    });

    if (response.ok && data) {
      redirect(307, `/q/${data.community.name}/posts/${data.id}/${data.slug}`);
    } else if (error) {
      const err = error.errors[0];
      // @ts-expect-error: because of dynamic attr
      return setError(form, err?.attr, err?.detail);
    }

    return withFiles({ form });
  }
};
