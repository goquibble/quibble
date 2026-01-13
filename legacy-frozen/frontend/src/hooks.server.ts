import api from '$lib/api';
import { handle_refresh_access_token, handle_verify_access_token } from '$lib/server/utils/auth';
import { set_cookies_from_header } from '$lib/server/utils/cookie';
import type { Handle } from '@sveltejs/kit';

const auth_routes = ['/login', '/register', '/password'];
const protected_routes = ['/submit', '/q/create', '/settings'];

export const handle: Handle = async ({ event, resolve }) => {
  const auth_token = event.cookies.get('jwt-auth');
  const refresh_token = event.cookies.get('jwt-refresh');
  const has_profile_selected = Boolean(event.cookies.get('profile-id'));

  let valid_token = false;

  if (auth_token && has_profile_selected) {
    valid_token = await handle_verify_access_token(auth_token);
  }

  if (!valid_token && refresh_token && has_profile_selected) {
    const res = await handle_refresh_access_token(
      refresh_token,
      event.request.headers.get('Cookie')
    );
    if (res && res.headers.getSetCookie()) {
      set_cookies_from_header(res.headers.getSetCookie(), event.cookies);
      valid_token = true;
    }
  }

  if (valid_token && has_profile_selected) {
    const { data, error, response } = await api.GET('/auth/user/', {
      headers: { Cookie: event.request.headers.get('Cookie') }
    });

    if (response.ok && data) {
      event.locals.user = data;
    } else if (error) {
      event.locals.user = null;
    }
  }

  // authenticated user cant access auth routes
  if (event.locals.user && auth_routes.some((route) => event.url.pathname.startsWith(route))) {
    return new Response(null, {
      status: 302,
      headers: { location: '/' }
    });
  }

  // unauthenticated user cant access protected routes
  if (
    !event.locals.user &&
    protected_routes.some((route) => event.url.pathname.startsWith(route))
  ) {
    const dest = event.url.pathname + event.url.search;
    const encoded_dest = encodeURIComponent(dest);
    return new Response(null, {
      status: 302,
      headers: { location: `/login?dest=${encoded_dest}` }
    });
  }

  return await resolve(event);
};
