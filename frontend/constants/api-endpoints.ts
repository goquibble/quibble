export const API_ENDPOINTS = {
  FEED: "api/v1/feed",
  // auth endpoints
  AUTH_REFRESH: "http://localhost:8002/api/v1/auth/refresh-token",
  AUTH_LOGOUT: "http://localhost:8002/api/v1/auth/logout",
  AUTH_APP_URL: "http://localhost:5173",
  // user endpoints
  USER_ME_PROFILE: "http://localhost:8002/api/v1/users/me",
  // USER_ME_PROFILES: "api/v1/user/me/profiles",
  // dyanmic api endpoints
  // search
  SEARCH: (query: string) => `api/v1/search?q=${query}`,
  // quiblet
  QUIBLET: (name?: string) => `api/v1/quiblet/${name || ""}`,
  QUIBLET_IS_UNIQUE_NAME: (name: string) =>
    `api/v1/quiblet/is-unique?name=${name}`,
  QUIBLET_HIGHLIGHTS: (name: string) => `api/v1/quiblet/${name}/highlights`,
  QUIBLET_QUIB: (name: string, id: string, slug: string) =>
    `api/v1/quiblet/${name}/quib/${id}/${slug}`,
  QUIBLET_QUIB_VOTE: (name: string, id: string, slug: string, value: number) =>
    `api/v1/quiblet/${name}/quib/${id}/${slug}/vote?value=${value}`,
  QUIBLET_QUIBS: (name: string) => `api/v1/quiblet/${name}/quibs`,
  QUIBLET_JOIN_OR_LEAVE: (name: string, action: "join" | "leave") =>
    `api/v1/quiblet/${name}/join-or-leave?action=${action}`,
  QUIBLET_MEMBERSHIP: (name: string) => `api/v1/quiblet/${name}/membership`,
  QUIBLET_QUIB_COMMENTS: (name: string, id: string, slug: string) =>
    `api/v1/quiblet/${name}/quib/${id}/${slug}/comments`,
};
