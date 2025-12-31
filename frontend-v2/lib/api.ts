import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  let csrftoken = Cookies.get("csrftoken");
  if (!csrftoken) {
    axios.get(`${config.baseURL}/api/v1/csrftoken`, {
      withCredentials: true,
    }); // after this cookie will be available
    csrftoken = Cookies.get("csrftoken");
  }

  if (csrftoken && config.method !== "get") {
    config.headers["X-CSRFToken"] = csrftoken;
  }

  return config;
});

export default api;
