import api from '$lib/api';
import { format_error_message_with_bold_prefix } from '$lib/functions/format-error-message';
import type { LayoutServerLoad } from './$types';
import { error as raise_error, redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ params }) => {
  const { data, error, response } = await api.GET('/q/communities/{name}/', {
    params: {
      path: { name: params.name }
    }
  });

  if (response.ok && data) {
    if (data.name !== params.name) {
      redirect(307, `/q/${data.name}`);
    }
    return { community: data };
  } else {
    raise_error(
      response.status,
      format_error_message_with_bold_prefix(error?.errors[0]?.detail ?? 'Not found.', 'q')
    );
  }
};
