import Cookies from "js-cookie";
import { isProd } from "./env";

export function setProfileIdCookie(profileId: string) {
  Cookies.set("profile_id", profileId, {
    path: "/",
    sameSite: "lax",
    secure: isProd,
    expires: 14, // 2 weeks
  });
}
