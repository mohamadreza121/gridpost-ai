export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { COLLECTIONS } from "@/lib/appwrite/ids";
import { getDocument, updateDocument } from "@/lib/appwrite/db";
import { getCurrentUserAndWorkspace } from "@/lib/workspace";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ accountId: string }> }
) {
  const { user, workspaceId } = await getCurrentUserAndWorkspace();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { accountId } = await params;
  const account = await getDocument<any>(COLLECTIONS.socialAccounts, accountId);

  if (account.workspace_id !== workspaceId) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const status = typeof body.status === "string" ? body.status : "connected";

  const updated = await updateDocument(COLLECTIONS.socialAccounts, accountId, {
    status,
    last_error: status === "needs_reconnect" ? "Reconnect required before live publishing." : "",
  });

  return NextResponse.json({ id: updated.$id, status });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ accountId: string }> }
) {
  const { user, workspaceId } = await getCurrentUserAndWorkspace();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { accountId } = await params;
  const account = await getDocument<any>(COLLECTIONS.socialAccounts, accountId);

  if (account.workspace_id !== workspaceId) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await updateDocument(COLLECTIONS.socialAccounts, accountId, {
    status: "disconnected",
    access_token_encrypted: "",
    refresh_token_encrypted: "",
    last_error: "Disconnected by user.",
  });

  return NextResponse.json({ id: accountId, status: "disconnected" });
}
