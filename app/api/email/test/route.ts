export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getServerEnv } from "@/lib/env";
import { getCurrentUserAndWorkspace } from "@/lib/workspace";

export async function POST() {
  const { user } = await getCurrentUserAndWorkspace();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const env = getServerEnv();

  if (!env.resendApiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY is not set." }, { status: 400 });
  }

  const to = env.resendNotifyEmail || user.email;
  if (!to) {
    return NextResponse.json({ error: "No recipient email available." }, { status: 400 });
  }

  const resend = new Resend(env.resendApiKey);
  const result = await resend.emails.send({
    from: env.resendFromEmail,
    to,
    subject: "GridPost AI email test",
    html: `<div style="font-family:Arial,sans-serif;background:#07080c;color:#f7f7fb;padding:24px;border-radius:16px"><h1>GridPost AI is connected.</h1><p>Resend is ready for scheduled-post confirmations, agent reports, and failure alerts.</p></div>`,
  });

  return NextResponse.json({ result });
}
