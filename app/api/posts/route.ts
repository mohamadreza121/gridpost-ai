export const runtime = "nodejs";

import { Query } from "node-appwrite";
import { NextResponse } from "next/server";
import { inngest } from "@/lib/inngest/client";
import { getCurrentUserAndWorkspace } from "@/lib/workspace";
import { COLLECTIONS } from "@/lib/appwrite/ids";
import { createDocument, listDocuments } from "@/lib/appwrite/db";

type PlatformPayload = {
  platform: string;
  caption: string;
};

function cleanPlatforms(value: unknown): PlatformPayload[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const platform = "platform" in item && typeof item.platform === "string" ? item.platform : "";
      const caption = "caption" in item && typeof item.caption === "string" ? item.caption : "";
      if (!platform || !caption) return null;
      return { platform, caption };
    })
    .filter(Boolean) as PlatformPayload[];
}

export async function GET() {
  const { user, workspaceId } = await getCurrentUserAndWorkspace();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!workspaceId) return NextResponse.json({ posts: [] });

  const posts = await listDocuments<any>(COLLECTIONS.posts, [
    Query.equal("workspace_id", workspaceId),
    Query.orderDesc("$createdAt"),
    Query.limit(20),
  ]);

  const platforms = await listDocuments<any>(COLLECTIONS.postPlatforms, [
    Query.equal("workspace_id", workspaceId),
    Query.limit(100),
  ]);

  return NextResponse.json({
    posts: posts.map((post) => ({
      id: post.$id,
      title: post.title,
      base_caption: post.base_caption,
      status: post.status,
      scheduled_at: post.scheduled_at,
      created_at: post.$createdAt,
      post_platforms: platforms
        .filter((platform) => platform.post_id === post.$id)
        .map((platform) => ({
          platform: platform.platform,
          caption: platform.caption,
          status: platform.status,
        })),
    })),
  });
}

export async function POST(request: Request) {
  const { user, workspaceId } = await getCurrentUserAndWorkspace();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!workspaceId) return NextResponse.json({ error: "Create a workspace first." }, { status: 400 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const title = "title" in body && typeof body.title === "string" && body.title.trim()
    ? body.title.trim()
    : "Untitled social post";
  const baseCaption = "baseCaption" in body && typeof body.baseCaption === "string" ? body.baseCaption.trim() : "";
  const scheduledAt = "scheduledAt" in body && typeof body.scheduledAt === "string" && body.scheduledAt ? body.scheduledAt : null;
  const timezone = "timezone" in body && typeof body.timezone === "string" ? body.timezone : "America/Toronto";
  const repeatRule = "repeatRule" in body && typeof body.repeatRule === "string" ? body.repeatRule : "none";
  const platforms = cleanPlatforms("platforms" in body ? body.platforms : []);

  if (!baseCaption) {
    return NextResponse.json({ error: "Caption is required." }, { status: 400 });
  }

  if (platforms.length === 0) {
    return NextResponse.json({ error: "Choose at least one platform." }, { status: 400 });
  }

  const status = scheduledAt ? "scheduled" : "draft";

  const post = await createDocument(COLLECTIONS.posts, {
    workspace_id: workspaceId,
    created_by: user.$id,
    title,
    base_caption: baseCaption,
    status,
    scheduled_at: scheduledAt,
    timezone,
    repeat_rule: repeatRule,
  });

  await Promise.all(
    platforms.map((platform) => createDocument(COLLECTIONS.postPlatforms, {
      post_id: post.$id,
      workspace_id: workspaceId,
      platform: platform.platform,
      caption: platform.caption,
      status,
    }))
  );

  if (scheduledAt) {
    await createDocument(COLLECTIONS.publishJobs, {
      workspace_id: workspaceId,
      post_id: post.$id,
      status: "queued",
      run_at: scheduledAt,
    });

    await inngest.send({
      name: "post/scheduled",
      data: {
        postId: post.$id,
        workspaceId,
        runAt: scheduledAt,
      },
    });
  }

  return NextResponse.json({ postId: post.$id, status });
}
