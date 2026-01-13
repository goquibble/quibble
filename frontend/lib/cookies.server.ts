import { cookies } from "next/headers";

export async function getAuthCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  const allowedNames = ["sessionid", "profile_id"];

  return cookieStore
    .getAll()
    .filter((cookie) => allowedNames.includes(cookie.name))
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
}
