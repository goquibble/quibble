import api from '$lib/api';
import type { Nullable } from '$lib/types/shared';

/**
 * A utility function to check if access token if valid or not.
 * @param access_token - Access token to check.
 * @returns Promise<boolean>
 */
export async function handle_verify_access_token(access_token: string): Promise<boolean> {
  const { response } = await api.POST('/auth/token/verify/', {
    body: { token: access_token }
  });

  return response.ok;
}

/**
 * A utility function to make API requests.
 * @param refresh_token - Refresh token to send along with request.
 * @param cookie_header - Cookies to send
 * @returns Promise<Nullable<Response>>
 */
export async function handle_refresh_access_token(
  refresh_token: string,
  cookie_header: Nullable<string>
): Promise<Nullable<Response>> {
  const { response, error } = await api.POST('/auth/token/refresh/', {
    headers: { Cookie: cookie_header },
    // @ts-expect-error: only refresh token required
    body: { refresh: refresh_token }
  });

  if (response.ok) {
    return response;
  } else {
    console.log('refresh_access_token failed with err: ', error);
    return null;
  }
}
