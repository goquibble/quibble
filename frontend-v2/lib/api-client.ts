export function getApiUrl(endpoint: string = ""): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  // one slash between base url and endpoint
  if (endpoint && !endpoint.startsWith("/")) {
    endpoint = `/${endpoint}`;
  }

  return `${baseUrl}${endpoint}`;
}
