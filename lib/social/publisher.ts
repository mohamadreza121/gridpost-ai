import "server-only";

import { Query } from "node-appwrite";
import { COLLECTIONS } from "@/lib/appwrite/ids";
import { createDocument, listDocuments, updateDocument } from "@/lib/appwrite/db";
import { validatePlatformPost } from "./validation";
import { getSocialPlatform, type SocialPlatformId } from "./platforms";

export type PostDocument = {
  workspace_id: string;
  title: string;
  base_caption: string;
  status: string;
};

export type PostPlatformDocument = {
  workspace_id: string;
  post_id: string;
  platform: SocialPlatformId;
  caption: string;
  status: string;
  social_account_id?: string;
};

export type SocialAccountDocument = {
  workspace_id: string;
  platform: SocialPlatformId;
  platform_account_id?: string;
  display_name?: string;
  username?: string;
  status: string;
  access_token_encrypted?: string;
  refresh_token_encrypted?: string;
  token_expires_at?: string;
};

export type PublishOutcome = {
  platform: SocialPlatformId;
  status: "posted" | "failed";
  externalPostId?: string;
  externalPostUrl?: string;
  response: Record<string, unknown>;
  errorMessage?: string;
};

export type PlatformPublisher = {
  platform: SocialPlatformId;
  validate: typeof validatePlatformPost;
  publish: (input: {
    post: PostDocument & { $id: string };
    platformPost: PostPlatformDocument & { $id: string };
    account?: SocialAccountDocument & { $id: string };
  }) => Promise<PublishOutcome>;
};

function makeDemoPublisher(platform: SocialPlatformId): PlatformPublisher {
  return {
    platform,
    validate: validatePlatformPost,
    async publish({ post, platformPost, account }) {
      const definition = getSocialPlatform(platform);
      const now = new Date().toISOString();
      const externalPostId = `demo_${platform}_${post.$id}_${Date.now()}`;

      return {
        platform,
        status: "posted",
        externalPostId,
        externalPostUrl: `https://example.com/gridpost/${platform}/${post.$id}`,
        response: {
          mode: "phase_1_5_demo_adapter",
          platform,
          platformLabel: definition?.label ?? platform,
          connectedAccount: account?.display_name ?? account?.username ?? null,
          captionPreview: platformPost.caption.slice(0, 160),
          publishedAt: now,
          nextStep: "Replace this demo publisher with the real OAuth/API adapter.",
        },
      };
    },
  };
}

export const platformPublishers: Record<SocialPlatformId, PlatformPublisher> = {
  instagram: makeDemoPublisher("instagram"),
  facebook: makeDemoPublisher("facebook"),
  linkedin: makeDemoPublisher("linkedin"),
  x: makeDemoPublisher("x"),
  tiktok: makeDemoPublisher("tiktok"),
  youtube: makeDemoPublisher("youtube"),
  pinterest: makeDemoPublisher("pinterest"),
};

export function getPublisher(platform: SocialPlatformId) {
  return platformPublishers[platform];
}

export async function findConnectedAccount(workspaceId: string, platform: string) {
  const accounts = await listDocuments<SocialAccountDocument>(COLLECTIONS.socialAccounts, [
    Query.equal("workspace_id", workspaceId),
    Query.equal("platform", platform),
    Query.equal("status", "connected"),
    Query.limit(1),
  ]);

  return accounts[0] ?? null;
}

export async function recordPublishOutcome(params: {
  workspaceId: string;
  postId: string;
  platformPostId: string;
  outcome: PublishOutcome;
}) {
  const now = new Date().toISOString();

  await createDocument(COLLECTIONS.publishResults, {
    workspace_id: params.workspaceId,
    post_id: params.postId,
    post_platform_id: params.platformPostId,
    platform: params.outcome.platform,
    status: params.outcome.status,
    external_post_id: params.outcome.externalPostId ?? "",
    external_url: params.outcome.externalPostUrl ?? "",
    error_message: params.outcome.errorMessage ?? "",
    response: JSON.stringify(params.outcome.response),
    published_at: params.outcome.status === "posted" ? now : null,
  });

  await updateDocument(COLLECTIONS.postPlatforms, params.platformPostId, {
    status: params.outcome.status,
    published_at: params.outcome.status === "posted" ? now : null,
    external_post_id: params.outcome.externalPostId ?? "",
    external_post_url: params.outcome.externalPostUrl ?? "",
    error_message: params.outcome.errorMessage ?? "",
  });
}
