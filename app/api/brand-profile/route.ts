import { Query } from "node-appwrite";
import { NextResponse } from "next/server";
import { getCurrentUserAndWorkspace } from "@/lib/workspace";
import { COLLECTIONS } from "@/lib/appwrite/ids";
import { createDocument, getFirstDocument, updateDocument } from "@/lib/appwrite/db";

export async function GET() {
  const { user, workspaceId } = await getCurrentUserAndWorkspace();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!workspaceId) return NextResponse.json({ profile: null });

  const profile = await getFirstDocument(COLLECTIONS.brandProfiles, [Query.equal("workspace_id", workspaceId)]);
  return NextResponse.json({ profile });
}

export async function POST(request: Request) {
  const { user, workspaceId } = await getCurrentUserAndWorkspace();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!workspaceId) return NextResponse.json({ error: "Create a workspace first." }, { status: 400 });

  const body = await request.json().catch(() => ({}));

  const payload = {
    workspace_id: workspaceId,
    brand_name: typeof body.brandName === "string" ? body.brandName : "GridSpell Studio",
    voice: typeof body.voice === "string" ? body.voice : "Premium, structured, clear, confident, modern.",
    audience: typeof body.audience === "string" ? body.audience : "Local businesses and service providers.",
    default_hashtags: typeof body.defaultHashtags === "string"
      ? body.defaultHashtags.split(/\s+/).map((tag: string) => tag.replace(/^#/, "")).filter(Boolean)
      : [],
    default_cta: typeof body.defaultCta === "string" ? body.defaultCta : "Start a project with GridSpell Studio.",
  };

  const existing = await getFirstDocument(COLLECTIONS.brandProfiles, [Query.equal("workspace_id", workspaceId)]);
  const profile = existing
    ? await updateDocument(COLLECTIONS.brandProfiles, existing.$id, payload)
    : await createDocument(COLLECTIONS.brandProfiles, payload);

  return NextResponse.json({ profile });
}
