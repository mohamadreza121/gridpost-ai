export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { clearAppwriteSessionCookie } from "@/lib/appwrite/cookies";
import { createSessionClient } from "@/lib/appwrite/session";

export async function POST() {
  try {
    const { account } = await createSessionClient();
    if (account) {
      await account.deleteSession({ sessionId: "current" }).catch(() => null);
    }
  } finally {
    await clearAppwriteSessionCookie();
  }

  return NextResponse.json({ ok: true });
}
