import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

import { tokenStore } from "@/lib/token-store";

api.interceptors.request.use((config) => {
  // Inject Access Token if available
  const token = tokenStore.getAccessToken();
  if (token) {
     config.headers.Authorization = `Bearer ${token}`;
  }

  let csrftoken = Cookies.get("csrftoken");
  if (!csrftoken) {
    // Attempt to fetch CSRF token if missing (though likely not needed for Bearer auth)
    // We can leave this or remove it. Since we moved to Bearer, this might be redundant.
    // But maybe some endpoints still use cookies?
    // Let's keep it for now but note it might be deprecated.
    axios.get(`${config.baseURL}/api/v1/csrftoken`, {
      withCredentials: true,
    }); 
    csrftoken = Cookies.get("csrftoken");
  }

  if (csrftoken && config.method !== "get") {
    config.headers["X-CSRFToken"] = csrftoken;
  }

  return config;
});

export default api;
