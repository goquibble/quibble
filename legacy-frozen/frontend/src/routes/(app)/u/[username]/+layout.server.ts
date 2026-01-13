import api from '$lib/api';
import { format_error_message_with_bold_prefix } from '$lib/functions/format-error-message';
import type { LayoutServerLoad } from './$types';
import { error as raise_error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ params }) => {
  const { data, error, response } = await api.GET('/u/profiles/{username}/', {
    params: { path: { username: params.username } }
  });

  if (response.ok && data) {
    return { profile: data };
  } else {
    raise_error(
      response.status,
      format_error_message_with_bold_prefix(error?.errors[0]?.detail ?? 'Not found.', 'u')
    );
  }
};
