import api from '$lib/api';
import { RegisterSchema } from '$lib/schemas/auth';
import { set_cookies_from_header } from '$lib/server/utils/cookie';
import type { PageServerLoad } from './$types';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ url }) => {
  const initial_data = { email: url.searchParams.get('email') ?? '' };
  const form = await superValidate(initial_data, zod(RegisterSchema), { errors: false });

  return { form };
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const form = await superValidate(request, zod(RegisterSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { data, error, response } = await api.POST('/auth/registration/', {
      body: { ...form.data }
    });

    if (response.ok && data) {
      const set_cookie_header = response.headers.getSetCookie();
      set_cookies_from_header(set_cookie_header, cookies);

      redirect(303, `/verification?email=${encodeURIComponent(form.data.email)}`);
    } else if (error) {
      return message(form, error.errors[0]?.detail, { status: 401 });
    }
  }
};
