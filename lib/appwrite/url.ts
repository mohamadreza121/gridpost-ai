import "server-only";

import { getServerEnv } from "@/lib/env";

export function getAppwriteFilePreviewUrl(fileId: string) {
  const env = getServerEnv();
  const endpoint = env.appwriteEndpoint.replace(/\/$/, "");
  return `${endpoint}/storage/buckets/${env.appwriteStorageBucketId}/files/${fileId}/preview?project=${env.appwriteProjectId}`;
}
