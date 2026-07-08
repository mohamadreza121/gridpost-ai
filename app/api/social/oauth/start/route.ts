export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getCurrentUserAndWorkspace } from "@/lib/workspace";
import { buildOAuthState, getOAuthReadiness } from "@/lib/social/oauth";
import { getSocialPlatform, isSocialPlatformId } from "@/lib/social/platforms";

export async function GET(request: Request) {
  const { user, workspaceId } = await getCurrentUserAndWorkspace();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!workspaceId) return NextResponse.json({ error: "Create a workspace first." }, { status: 400 });

  const url = new URL(request.url);
  const platform = url.searchParams.get("platform") ?? "";

  if (!isSocialPlatformId(platform)) {
    return NextResponse.json({ error: "Unsupported platform." }, { status: 400 });
  }

  const definition = getSocialPlatform(platform);
  const readiness = getOAuthReadiness(platform);
  const state = buildOAuthState({ workspaceId, platform, returnTo: "/dashboard/accounts" });

  if (!readiness.configured) {
    return NextResponse.json({
      platform,
      label: definition?.label ?? platform,
      ready: false,
      state,
      missing: readiness.missing,
      message: `${definition?.label ?? platform} OAuth route is ready, but provider keys are not configured yet.`,
    }, { status: 501 });
  }

  return NextResponse.json({
    platform,
    label: definition?.label ?? platform,
    ready: true,
    state,
    message: "Provider-specific authorization URL builder will be connected in that platform phase.",
  }, { status: 501 });
}
