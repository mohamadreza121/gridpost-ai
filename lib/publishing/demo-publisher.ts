import "server-only";

import { Query } from "node-appwrite";
import { COLLECTIONS } from "@/lib/appwrite/ids";
import { createDocument, getDocument, listDocuments, updateDocument } from "@/lib/appwrite/db";

export async function markPostAsPosted(postId: string) {
  const now = new Date().toISOString();

  const post = await getDocument<any>(COLLECTIONS.posts, postId);

  const platforms = await listDocuments<any>(COLLECTIONS.postPlatforms, [
    Query.equal("post_id", postId),
    Query.limit(50),
  ]);

  await updateDocument(COLLECTIONS.posts, postId, { status: "posted", published_at: now });

  await Promise.all(
    platforms.map((platform) => updateDocument(COLLECTIONS.postPlatforms, platform.$id, {
      status: "posted",
      published_at: now,
    }))
  );

  const jobs = await listDocuments<any>(COLLECTIONS.publishJobs, [
    Query.equal("post_id", postId),
    Query.equal("status", ["queued", "running"]),
    Query.limit(25),
  ]);

  await Promise.all(
    jobs.map((job) => updateDocument(COLLECTIONS.publishJobs, job.$id, {
      status: "completed",
      completed_at: now,
      error_message: "",
    }))
  );

  await Promise.all(
    platforms.map((item) => createDocument(COLLECTIONS.publishResults, {
      workspace_id: post.workspace_id,
      post_id: postId,
      post_platform_id: item.$id,
      platform: item.platform,
      status: "posted",
      external_url: `https://example.com/demo/${item.platform}/${postId}`,
      response: JSON.stringify({ mode: "phase_1_demo_publisher", publishedAt: now }),
    }))
  );

  return {
    postId,
    platforms: platforms.map((item) => item.platform),
    publishedAt: now,
  };
}

export async function failPublishJob(postId: string, error: unknown) {
  const errorMessage = error instanceof Error ? error.message : "Unknown publish error";
  const jobs = await listDocuments<any>(COLLECTIONS.publishJobs, [
    Query.equal("post_id", postId),
    Query.equal("status", ["queued", "running"]),
    Query.limit(25),
  ]);

  await Promise.all(
    jobs.map((job) => updateDocument(COLLECTIONS.publishJobs, job.$id, {
      status: "failed",
      error_message: errorMessage,
      completed_at: new Date().toISOString(),
    }))
  );

  await updateDocument(COLLECTIONS.posts, postId, { status: "failed" });

  const platforms = await listDocuments<any>(COLLECTIONS.postPlatforms, [Query.equal("post_id", postId), Query.limit(50)]);
  await Promise.all(platforms.map((platform) => updateDocument(COLLECTIONS.postPlatforms, platform.$id, { status: "failed" })));
}
