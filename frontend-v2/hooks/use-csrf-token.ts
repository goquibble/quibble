import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export function useCsrfToken() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    let token = Cookies.get("csrftoken");
    if (token) {
      setCsrfToken(token);
    } else {
      fetch("http://localhost:8000/api/v1/csrf-token", {
        method: "GET",
        credentials: "include",
      }).then(() => {
        token = Cookies.get("csrftoken");
        setCsrfToken(token || null);
      });
    }
  }, []);

  return csrfToken;
}
