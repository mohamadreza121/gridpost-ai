export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { inngest } from "@/lib/inngest/client";
import { COLLECTIONS } from "@/lib/appwrite/ids";
import { createDocument, getDocument, updateDocument } from "@/lib/appwrite/db";
import { getCurrentUserAndWorkspace } from "@/lib/workspace";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { user, workspaceId } = await getCurrentUserAndWorkspace();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { postId } = await params;
  const post = await getDocument<any>(COLLECTIONS.posts, postId);

  if (post.workspace_id !== workspaceId) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const runAt = new Date().toISOString();

  await updateDocument(COLLECTIONS.posts, postId, { status: "scheduled" });
  await createDocument(COLLECTIONS.publishJobs, {
    workspace_id: workspaceId,
    post_id: postId,
    status: "queued",
    run_at: runAt,
    retry_count: 1,
    error_message: "",
  });

  await inngest.send({
    name: "post/scheduled",
    data: { postId, workspaceId, runAt, retry: true },
  });

  return NextResponse.json({ postId, status: "queued", message: "Retry queued with Inngest." });
}
