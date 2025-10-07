export const API_ENDPOINTS = {
  FEED: "api/v1/feed",
  AUTH: {
    LOGIN: "_allauth/browser/v1/auth/login",
    SIGNUP: "_allauth/browser/v1/auth/signup",
    LOGOUT_SESSION: "_allauth/browser/v1/auth/session",
    VERIFY_EMAIL: "_allauth/browser/v1/auth/email/verify",
  },
  USER: {
    ME_PROFILE: "api/v1/user/me/profile",
    ME_PROFILES: "api/v1/user/me/profiles",
  },
  // dyanmic api endpoints
  SEARCH: (query: string) => `api/v1/search?q=${query}`,
  QUIBLET: (name?: string) => `api/v1/quiblet/${name || ""}`,
};
