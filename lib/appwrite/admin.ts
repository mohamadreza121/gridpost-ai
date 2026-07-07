import "server-only";

import { Account, Client, Databases, Storage, Users } from "node-appwrite";
import { assertAppwriteAdminEnv } from "@/lib/env";

export function createAdminClient() {
  const env = assertAppwriteAdminEnv();

  const client = new Client()
    .setEndpoint(env.appwriteEndpoint)
    .setProject(env.appwriteProjectId)
    .setKey(env.appwriteApiKey);

  return {
    client,
    account: new Account(client),
    databases: new Databases(client),
    storage: new Storage(client),
    users: new Users(client),
  };
}
