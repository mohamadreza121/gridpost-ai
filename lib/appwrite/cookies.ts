import "server-only";

import { cookies } from "next/headers";
import { getServerEnv } from "@/lib/env";

export async function setAppwriteSessionCookie(secret: string, expires: string) {
  const env = getServerEnv();
  const cookieStore = await cookies();
  const isLocal = env.siteUrl.startsWith("http://localhost");

  cookieStore.set(env.appwriteCookieName, secret, {
    httpOnly: true,
    secure: !isLocal,
    sameSite: "strict",
    expires: new Date(expires),
    path: "/",
  });
}

export async function clearAppwriteSessionCookie() {
  const env = getServerEnv();
  const cookieStore = await cookies();

  cookieStore.set(env.appwriteCookieName, "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
}
