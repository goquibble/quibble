import api from '$lib/api';
import { create_form_data, type FormDataObject } from '$lib/functions/form';
import { ProfileSettingsSchema, type ProfileSettingsType } from '$lib/schemas/settings';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ request }) => {
  const { response, data } = await api.GET('/u/me/profile/', {
    headers: { Cookie: request.headers.get('Cookie') }
  });

  if (response.ok && data) {
    const initial_data: ProfileSettingsType = {
      username: data.username,
      name: data.name ?? undefined,
      bio: data.bio ?? undefined,
      avatar: undefined,
      banner: undefined
    };

    const form = await superValidate(initial_data, zod(ProfileSettingsSchema));

    return { profile: data, form };
  }
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const form = await superValidate(request, zod(ProfileSettingsSchema));

    if (!form.valid) {
      console.log(form.errors);
      return fail(400, withFiles({ form }));
    }

    const { response, data, error } = await api.PATCH('/u/me/profiles/{id}/', {
      headers: { Cookie: request.headers.get('Cookie') },
      params: { path: { id: Number(cookies.get('profile-id')) } },
      // @ts-expect-error: sending formdata instead of string object
      body: { ...form.data },
      bodySerializer(body) {
        return create_form_data(body as unknown as FormDataObject);
      }
    });

    if (response.ok && data) {
      return withFiles({ form });
    } else if (error) {
      console.error(error);
      const err = error.errors[0];
      // @ts-expect-error: because of dynamic attr
      return setError(form, err?.attr, err?.detail);
    }

    return withFiles({ form });
  }
};
