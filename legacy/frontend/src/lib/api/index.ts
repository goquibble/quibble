import { PUBLIC_API_URL } from '$env/static/public';
import type { paths } from './v1';
import createClient from 'openapi-fetch';

const client = createClient<paths>({
  baseUrl: `${PUBLIC_API_URL}/api/v1/`,
  credentials: 'include'
});

export default client;
export type * from './v1';
