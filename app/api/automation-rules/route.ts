import { NextResponse } from "next/server";
import { getCurrentUserAndWorkspace } from "@/lib/workspace";
import { COLLECTIONS } from "@/lib/appwrite/ids";
import { createDocument } from "@/lib/appwrite/db";

export async function POST(request: Request) {
  const { user, workspaceId } = await getCurrentUserAndWorkspace();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!workspaceId) return NextResponse.json({ error: "Create a workspace first." }, { status: 400 });

  const body = await request.json().catch(() => ({}));
  const rules = Array.isArray(body.rules) ? body.rules : [];

  if (rules.length === 0) {
    return NextResponse.json({ error: "No rules provided." }, { status: 400 });
  }

  await Promise.all(
    rules.map((rule: any) => createDocument(COLLECTIONS.automationRules, {
      workspace_id: workspaceId,
      rule_type: typeof rule.name === "string" ? rule.name : "custom_rule",
      enabled: Boolean(rule.enabled),
      config: JSON.stringify(rule),
    }))
  );

  return NextResponse.json({ saved: rules.length });
}
