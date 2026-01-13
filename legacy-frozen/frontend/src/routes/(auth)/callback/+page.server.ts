import api from '$lib/api';
import { set_cookies_from_header } from '$lib/server/utils/cookie';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ request, url, cookies }) => {
  const code = url.searchParams.get('code');
  if (code) {
    const { data, response, error } = await api.POST('/auth/google/', {
      headers: { Cookie: request.headers.get('Cookie') },
      body: { code }
    });

    if (response.ok && data) {
      const set_cookie_header = response.headers.getSetCookie();
      set_cookies_from_header(set_cookie_header, cookies);

      redirect(303, `/login?type=p-select`);
    } else {
      console.error(error);
    }
  }
};
