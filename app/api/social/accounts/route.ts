export const runtime = "nodejs";

import { Query } from "node-appwrite";
import { NextResponse } from "next/server";
import { COLLECTIONS } from "@/lib/appwrite/ids";
import { createDocument, listDocuments } from "@/lib/appwrite/db";
import { getCurrentUserAndWorkspace } from "@/lib/workspace";
import { encryptToken } from "@/lib/security/token-crypto";
import { getOAuthReadiness } from "@/lib/social/oauth";
import { getSocialPlatform, isSocialPlatformId, SOCIAL_PLATFORMS } from "@/lib/social/platforms";

export async function GET() {
  const { user, workspaceId } = await getCurrentUserAndWorkspace();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!workspaceId) return NextResponse.json({ accounts: [] });

  const accounts = await listDocuments<any>(COLLECTIONS.socialAccounts, [
    Query.equal("workspace_id", workspaceId),
    Query.orderDesc("$updatedAt"),
    Query.limit(100),
  ]);

  return NextResponse.json({
    accounts: accounts.map((account) => ({
      id: account.$id,
      platform: account.platform,
      displayName: account.display_name,
      username: account.username,
      avatarUrl: account.avatar_url,
      status: account.status,
      platformAccountId: account.platform_account_id,
      scopes: account.scopes ?? [],
      tokenExpiresAt: account.token_expires_at,
      connectedAt: account.connected_at,
      lastError: account.last_error,
      oauth: getOAuthReadiness(account.platform),
    })),
    platformReadiness: SOCIAL_PLATFORMS.map((platform) => getOAuthReadiness(platform.id)),
  });
}

export async function POST(request: Request) {
  const { user, workspaceId } = await getCurrentUserAndWorkspace();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!workspaceId) return NextResponse.json({ error: "Create a workspace first." }, { status: 400 });

  const body = await request.json().catch(() => null);
  const platform = body && typeof body.platform === "string" ? body.platform : "";

  if (!isSocialPlatformId(platform)) {
    return NextResponse.json({ error: "Unsupported platform." }, { status: 400 });
  }

  const definition = getSocialPlatform(platform);
  const now = new Date().toISOString();
  const displayName = body && typeof body.displayName === "string" && body.displayName.trim()
    ? body.displayName.trim()
    : `${definition?.label ?? platform} Demo Account`;
  const username = body && typeof body.username === "string" && body.username.trim()
    ? body.username.trim()
    : definition?.handleLabel ?? `@gridspellstudio`;

  const existing = await listDocuments<any>(COLLECTIONS.socialAccounts, [
    Query.equal("workspace_id", workspaceId),
    Query.equal("platform", platform),
    Query.notEqual("status", "disconnected"),
    Query.limit(1),
  ]);

  if (existing[0]) {
    return NextResponse.json({
      accountId: existing[0].$id,
      status: existing[0].status,
      message: `${definition?.label ?? platform} already has an active account row.`,
    });
  }

  const account = await createDocument(COLLECTIONS.socialAccounts, {
    workspace_id: workspaceId,
    platform,
    platform_account_id: `demo_${platform}_${user.$id}`,
    display_name: displayName,
    username,
    avatar_url: "",
    status: "connected",
    scopes: ["demo.publish", "demo.analytics"],
    access_token_encrypted: encryptToken(`demo-access-token-${platform}-${user.$id}-${Date.now()}`),
    refresh_token_encrypted: encryptToken(`demo-refresh-token-${platform}-${user.$id}-${Date.now()}`),
    token_expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    token_last_refreshed_at: now,
    connected_at: now,
    last_error: "",
    config: JSON.stringify({ mode: "phase_1_5_demo_connection", oauth: getOAuthReadiness(platform) }),
  });

  return NextResponse.json({
    accountId: account.$id,
    status: "connected",
    message: `${definition?.label ?? platform} demo connection created. Replace with OAuth in Phase 2.`,
  });
}
