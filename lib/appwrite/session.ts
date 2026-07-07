import "server-only";

import { Account, Client } from "node-appwrite";
import { cookies } from "next/headers";
import { assertAppwriteEnv } from "@/lib/env";

export async function getSessionSecret() {
  const env = assertAppwriteEnv();
  const cookieStore = await cookies();
  return cookieStore.get(env.appwriteCookieName)?.value ?? null;
}

export async function createSessionClient() {
  const env = assertAppwriteEnv();
  const sessionSecret = await getSessionSecret();

  if (!sessionSecret) {
    return { client: null, account: null, sessionSecret: null };
  }

  const client = new Client()
    .setEndpoint(env.appwriteEndpoint)
    .setProject(env.appwriteProjectId)
    .setSession(sessionSecret);

  return {
    client,
    account: new Account(client),
    sessionSecret,
  };
}

export async function getCurrentUser() {
  const { account } = await createSessionClient();

  if (!account) return null;

  try {
    return await account.get();
  } catch {
    return null;
  }
}
