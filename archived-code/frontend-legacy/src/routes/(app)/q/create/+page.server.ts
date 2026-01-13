import api from '$lib/api';
import { create_form_data, type FormDataObject } from '$lib/functions/form';
import { CommunityCreateSchema } from '$lib/schemas/community-create';
import type { PageServerLoad } from './$types';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { setError, superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async () => {
  const form = await superValidate(zod(CommunityCreateSchema));

  return { form };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zod(CommunityCreateSchema));

    if (!form.valid) {
      console.log(form.errors);
      return fail(400, withFiles({ form }));
    }

    const { data, response, error } = await api.POST('/q/communities/', {
      headers: { Cookie: request.headers.get('Cookie') },
      // @ts-expect-error: only requires username for POST req
      body: { ...form.data },
      bodySerializer(body) {
        return create_form_data(body as unknown as FormDataObject);
      }
    });

    if (response.ok && data) {
      redirect(307, `/q/${data.name}`);
    } else if (error) {
      const err = error.errors[0];
      // @ts-expect-error: because of dynamic attr
      return setError(form, err?.attr, err?.detail);
    }

    return withFiles({ form });
  }
};
