export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { readOAuthState } from "@/lib/social/oauth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const state = url.searchParams.get("state") ?? "";
  const code = url.searchParams.get("code") ?? "";
  const parsedState = state ? readOAuthState(state) : null;

  return NextResponse.json({
    ready: false,
    hasCode: Boolean(code),
    state: parsedState,
    message: "OAuth callback shell is wired. Platform-specific token exchange will be added one API at a time.",
  }, { status: 501 });
}
