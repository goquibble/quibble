import { dev } from '$app/environment';
import type { Cookies } from '@sveltejs/kit';
import set_cookie_parser from 'set-cookie-parser';

/**
 * Parses and set cookies from a `Set-Cookie` header.
 * @param set_cookie_header - The `Set-Cookie` header from response.
 * @param cookies - Cookies API
 */
export function set_cookies_from_header(set_cookie_header: string[], cookies: Cookies) {
  if (!set_cookie_header) return;

  // parse set-cookie header
  const parsed_cookies = set_cookie_parser(set_cookie_header);
  // set each cookie
  parsed_cookies.forEach((cookie) => {
    const sameSite = cookie.sameSite
      ? (cookie.sameSite.toLowerCase() as 'strict' | 'lax' | 'none')
      : undefined;

    const domain = cookie.domain;

    cookies.set(cookie.name, cookie.value, {
      ...cookie,
      path: cookie.path ?? '/',
      secure: cookie.secure ?? !dev,
      domain,
      sameSite
    });
  });
}
