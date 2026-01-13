import api from '$lib/api';
import { VerificationCodeSchema } from '$lib/schemas/auth';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ url }) => {
  const initial_data = {
    code: url.searchParams.get('code') ?? '',
    email: url.searchParams.get('code')
  };
  const form = await superValidate({ code: initial_data.code }, zod(VerificationCodeSchema), {
    errors: false
  });

  return { form, email: initial_data.email };
};

export const actions: Actions = {
  default: async ({ request, url }) => {
    const form = await superValidate(request, zod(VerificationCodeSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { response, error } = await api.POST('/auth/registration/verify-email/', {
      headers: { Cookie: request.headers.get('Cookie') },
      body: { key: form.data.code }
    });

    if (response.ok) {
      const email = url.searchParams.get('email');
      redirect(303, email ? `/login?email=${encodeURIComponent(email)}` : `/login`);
    } else if (error) {
      return setError(form, 'code', String(error.errors[0]?.detail));
    }
  }
};
