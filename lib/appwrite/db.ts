import "server-only";

import { ID, Query } from "node-appwrite";
import { getServerEnv } from "@/lib/env";
import { createAdminClient } from "@/lib/appwrite/admin";
import { COLLECTIONS } from "@/lib/appwrite/ids";

export type AppwriteDocument<T> = T & {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
};

export function parseJsonField<T>(value: unknown, fallback: T): T {
  if (typeof value !== "string" || !value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export async function listDocuments<T>(collectionId: string, queries: string[] = []) {
  const env = getServerEnv();
  const { databases } = createAdminClient();
  const response = await databases.listDocuments({
    databaseId: env.appwriteDatabaseId,
    collectionId,
    queries,
  });

  return response.documents as unknown as AppwriteDocument<T>[];
}

export async function getFirstDocument<T>(collectionId: string, queries: string[] = []) {
  const docs = await listDocuments<T>(collectionId, [...queries, Query.limit(1)]);
  return docs[0] ?? null;
}

export async function createDocument<T extends Record<string, unknown>>(collectionId: string, data: T, id = ID.unique()) {
  const env = getServerEnv();
  const { databases } = createAdminClient();
  return await databases.createDocument({
    databaseId: env.appwriteDatabaseId,
    collectionId,
    documentId: id,
    data,
  });
}

export async function getDocument<T>(collectionId: string, documentId: string) {
  const env = getServerEnv();
  const { databases } = createAdminClient();
  const document = await databases.getDocument({
    databaseId: env.appwriteDatabaseId,
    collectionId,
    documentId,
  });

  return document as unknown as AppwriteDocument<T>;
}

export async function updateDocument<T extends Record<string, unknown>>(collectionId: string, documentId: string, data: Partial<T>) {
  const env = getServerEnv();
  const { databases } = createAdminClient();
  return await databases.updateDocument({
    databaseId: env.appwriteDatabaseId,
    collectionId,
    documentId,
    data,
  });
}

export async function ensureWorkspaceForUser(userId: string, workspaceName = "GridSpell Studio") {
  const membership = await getFirstDocument<{ workspace_id: string }>(COLLECTIONS.workspaceMembers, [
    Query.equal("user_id", userId),
  ]);

  if (membership?.workspace_id) {
    return membership.workspace_id;
  }

  const workspace = await createDocument(COLLECTIONS.workspaces, {
    name: workspaceName,
    owner_id: userId,
  });

  await createDocument(COLLECTIONS.workspaceMembers, {
    workspace_id: workspace.$id,
    user_id: userId,
    role: "owner",
  });

  await createDocument(COLLECTIONS.brandProfiles, {
    workspace_id: workspace.$id,
    brand_name: workspaceName,
    voice: "Premium, structured, clear, confident, modern, not boring, dark studio energy with practical business value.",
    audience: "Local businesses, service providers, startups, and brands needing premium websites or dashboards.",
    default_hashtags: ["webdesign", "webdevelopment", "smallbusinesswebsite", "branding", "seo", "gridspellstudio"],
    default_cta: "Start a project with GridSpell Studio.",
  });

  return workspace.$id;
}
