export const runtime = "nodejs";

import { ID } from "node-appwrite";
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

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters for Appwrite auth." }, { status: 400 });
  }

  try {
    const { account, users } = createAdminClient();
    const user = await users.create({
      userId: ID.unique(),
      email,
      password,
      name: workspaceName,
    });

    await ensureWorkspaceForUser(user.$id, workspaceName);

    const session = await account.createEmailPasswordSession({ email, password });
    await setAppwriteSessionCookie(session.secret, session.expire);

    return NextResponse.json({ ok: true, userId: user.$id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not create Appwrite account." },
      { status: 400 }
    );
  }
}
