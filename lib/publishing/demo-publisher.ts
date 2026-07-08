import "server-only";

import { Query } from "node-appwrite";
import { COLLECTIONS } from "@/lib/appwrite/ids";
import { getDocument, listDocuments, updateDocument } from "@/lib/appwrite/db";
import {
  findConnectedAccount,
  getPublisher,
  recordPublishOutcome,
  type PostDocument,
  type PostPlatformDocument,
} from "@/lib/social/publisher";
import { isSocialPlatformId } from "@/lib/social/platforms";

export async function markPostAsPosted(postId: string) {
  const now = new Date().toISOString();
  const post = await getDocument<PostDocument>(COLLECTIONS.posts, postId);

  const platforms = await listDocuments<PostPlatformDocument>(COLLECTIONS.postPlatforms, [
    Query.equal("post_id", postId),
    Query.limit(50),
  ]);

  const outcomes = await Promise.all(
    platforms.map(async (platformPost) => {
      if (!isSocialPlatformId(platformPost.platform)) {
        const outcome = {
          platform: platformPost.platform,
          status: "failed" as const,
          errorMessage: `${platformPost.platform} is not supported by the publisher registry.`,
          response: { mode: "phase_1_5_validation_failure" },
        };

        await updateDocument(COLLECTIONS.postPlatforms, platformPost.$id, {
          status: "failed",
          error_message: outcome.errorMessage,
        });

        return outcome;
      }

      const account = platformPost.social_account_id
        ? await getDocument<any>(COLLECTIONS.socialAccounts, platformPost.social_account_id).catch(() => null)
        : await findConnectedAccount(post.workspace_id, platformPost.platform);

      const publisher = getPublisher(platformPost.platform);
      const validation = publisher.validate({
        platform: platformPost.platform,
        caption: platformPost.caption,
        hasConnectedAccount: Boolean(account),
      });

      if (!validation.ok) {
        const outcome = {
          platform: platformPost.platform,
          status: "failed" as const,
          errorMessage: validation.blocking.join(" "),
          response: { mode: "phase_1_5_validation_failure", warnings: validation.warnings },
        };

        await recordPublishOutcome({
          workspaceId: post.workspace_id,
          postId,
          platformPostId: platformPost.$id,
          outcome,
        });

        return outcome;
      }

      const outcome = await publisher.publish({
        post: { ...post, $id: postId },
        platformPost,
        account: account ?? undefined,
      });

      await recordPublishOutcome({
        workspaceId: post.workspace_id,
        postId,
        platformPostId: platformPost.$id,
        outcome,
      });

      return outcome;
    })
  );

  const failed = outcomes.filter((outcome) => outcome.status === "failed");
  const posted = outcomes.filter((outcome) => outcome.status === "posted");
  const finalStatus = failed.length === 0 ? "posted" : posted.length > 0 ? "partial" : "failed";

  await updateDocument(COLLECTIONS.posts, postId, {
    status: finalStatus,
    published_at: posted.length > 0 ? now : null,
  });

  const jobs = await listDocuments<any>(COLLECTIONS.publishJobs, [
    Query.equal("post_id", postId),
    Query.equal("status", ["queued", "running"]),
    Query.limit(25),
  ]);

  await Promise.all(
    jobs.map((job) => updateDocument(COLLECTIONS.publishJobs, job.$id, {
      status: failed.length > 0 ? "failed" : "completed",
      completed_at: now,
      error_message: failed.map((outcome) => `${outcome.platform}: ${outcome.errorMessage}`).join(" | "),
    }))
  );

  if (failed.length > 0 && posted.length === 0) {
    throw new Error(failed.map((outcome) => `${outcome.platform}: ${outcome.errorMessage}`).join(" | "));
  }

  return {
    postId,
    platforms: outcomes.map((item) => item.platform),
    publishedAt: now,
    status: finalStatus,
  };
}

export async function failPublishJob(postId: string, error: unknown) {
  const errorMessage = error instanceof Error ? error.message : "Unknown publish error";
  const now = new Date().toISOString();

  const jobs = await listDocuments<any>(COLLECTIONS.publishJobs, [
    Query.equal("post_id", postId),
    Query.equal("status", ["queued", "running"]),
    Query.limit(25),
  ]);

  await Promise.all(
    jobs.map((job) => updateDocument(COLLECTIONS.publishJobs, job.$id, {
      status: "failed",
      error_message: errorMessage,
      completed_at: now,
    }))
  );

  await updateDocument(COLLECTIONS.posts, postId, { status: "failed" });

  const platforms = await listDocuments<any>(COLLECTIONS.postPlatforms, [Query.equal("post_id", postId), Query.limit(50)]);
  await Promise.all(platforms.map((platform) => updateDocument(COLLECTIONS.postPlatforms, platform.$id, {
    status: "failed",
    error_message: errorMessage,
  })));
}
