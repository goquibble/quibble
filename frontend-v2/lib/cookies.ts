import Cookies from "js-cookie";
import { IS_PROD } from "@/constants/env";

export function setProfileIdCookie(profileId: string) {
  Cookies.set("profile_id", profileId, {
    path: "/",
    sameSite: "lax",
    secure: IS_PROD,
    expires: 14, // 2 weeks
  });
}
