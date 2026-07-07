import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/appwrite/session";
import { ensureWorkspaceForUser } from "@/lib/appwrite/db";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const workspaceName = typeof body.workspaceName === "string" && body.workspaceName.trim()
    ? body.workspaceName.trim()
    : "GridSpell Studio";

  const workspaceId = await ensureWorkspaceForUser(user.$id, workspaceName);
  return NextResponse.json({ workspaceId });
}
