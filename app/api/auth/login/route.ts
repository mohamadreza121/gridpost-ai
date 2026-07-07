export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/appwrite/admin";
import { setAppwriteSessionCookie } from "@/lib/appwrite/cookies";
import { ensureWorkspaceForUser } from "@/lib/appwrite/db";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const workspaceName = typeof body.workspaceName === "string" && body.workspaceName.trim()
    ? body.workspaceName.trim()
    : "GridSpell Studio";

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  try {
    const { account } = createAdminClient();
    const session = await account.createEmailPasswordSession({ email, password });
    await setAppwriteSessionCookie(session.secret, session.expire);

    if (session.userId) {
      await ensureWorkspaceForUser(session.userId, workspaceName);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not log in with Appwrite." },
      { status: 400 }
    );
  }
}
