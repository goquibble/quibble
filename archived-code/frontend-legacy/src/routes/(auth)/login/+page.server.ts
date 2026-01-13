import api from '$lib/api';
import { create_form_data, type FormDataObject } from '$lib/functions/form';
import { LoginSchema, ProfileCreateSchema } from '$lib/schemas/auth';
import { set_cookies_from_header } from '$lib/server/utils/cookie';
import type { PageServerLoad } from './$types';
import { fail, type Actions } from '@sveltejs/kit';
import { message, superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ url }) => {
  const initial_data = { email: url.searchParams.get('email') ?? '' };
  const form = await superValidate(initial_data, zod(LoginSchema), { errors: false });

  return { form };
};

export const actions: Actions = {
  login: async ({ request, cookies }) => {
    const form = await superValidate(request, zod(LoginSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { data, error, response } = await api.POST('/auth/login/', {
      body: { ...form.data }
    });

    if (response.ok && data) {
      const set_cookie_header = response.headers.getSetCookie();
      set_cookies_from_header(set_cookie_header, cookies);

      return { form };
    } else if (error) {
      return message(form, error.errors[0]?.detail, { status: 401 });
    }
  },
  create: async ({ request }) => {
    const form = await superValidate(request, zod(ProfileCreateSchema));

    if (!form.valid) {
      return fail(400, withFiles({ form }));
    }

    const { data, error, response } = await api.POST('/u/me/profiles/', {
      headers: { Cookie: request.headers.get('Cookie') },
      // @ts-expect-error: only requires username for POST req
      body: { ...form.data },
      bodySerializer(body) {
        return create_form_data(body as unknown as FormDataObject);
      }
    });

    if (response.ok && data) {
      return withFiles({ form, profile: data });
    } else if (error) {
      return message(form, error.errors[0]?.detail, { status: 401 });
    }

    // https://superforms.rocks/concepts/files#returning-files-in-form-actions
    return withFiles({ form });
  }
};
