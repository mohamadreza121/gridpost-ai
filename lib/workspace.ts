import "server-only";

import { Query } from "node-appwrite";
import { getCurrentUser } from "@/lib/appwrite/session";
import { getFirstDocument } from "@/lib/appwrite/db";
import { COLLECTIONS } from "@/lib/appwrite/ids";

export async function getCurrentUserAndWorkspace() {
  const user = await getCurrentUser();

  if (!user) {
    return { user: null, workspaceId: null };
  }

  const membership = await getFirstDocument<{ workspace_id: string }>(COLLECTIONS.workspaceMembers, [
    Query.equal("user_id", user.$id),
  ]);

  return { user, workspaceId: membership?.workspace_id ?? null };
}
