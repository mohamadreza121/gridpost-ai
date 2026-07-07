export const runtime = "nodejs";

import { ID, Query } from "node-appwrite";
import { NextResponse } from "next/server";
import { getServerEnv } from "@/lib/env";
import { getCurrentUserAndWorkspace } from "@/lib/workspace";
import { COLLECTIONS } from "@/lib/appwrite/ids";
import { createAdminClient } from "@/lib/appwrite/admin";
import { createDocument, listDocuments } from "@/lib/appwrite/db";
import { getAppwriteFilePreviewUrl } from "@/lib/appwrite/url";

export async function GET() {
  const { user, workspaceId } = await getCurrentUserAndWorkspace();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!workspaceId) return NextResponse.json({ media: [] });

  const data = await listDocuments(COLLECTIONS.mediaAssets, [
    Query.equal("workspace_id", workspaceId),
    Query.orderDesc("$createdAt"),
    Query.limit(40),
  ]);

  return NextResponse.json({
    media: data.map((item: any) => ({
      id: item.$id,
      name: item.name,
      file_type: item.file_type,
      file_size: item.file_size,
      storage_path: item.storage_path,
      public_url: item.public_url,
      tags: item.tags ?? [],
      created_at: item.$createdAt,
    })),
  });
}

export async function POST(request: Request) {
  const { user, workspaceId } = await getCurrentUserAndWorkspace();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!workspaceId) return NextResponse.json({ error: "Create a workspace first." }, { status: 400 });

  const env = getServerEnv();
  const formData = await request.formData();
  const file = formData.get("file");
  const tag = formData.get("tag");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  const { storage } = createAdminClient();
  const appwriteFile = await storage.createFile({
    bucketId: env.appwriteStorageBucketId,
    fileId: ID.unique(),
    file,
  });

  const publicUrl = getAppwriteFilePreviewUrl(appwriteFile.$id);

  const asset = await createDocument(COLLECTIONS.mediaAssets, {
    workspace_id: workspaceId,
    uploaded_by: user.$id,
    name: file.name,
    file_type: file.type || "application/octet-stream",
    file_size: file.size,
    storage_bucket: env.appwriteStorageBucketId,
    storage_path: appwriteFile.$id,
    public_url: publicUrl,
    tags: typeof tag === "string" && tag ? [tag] : ["Uploaded"],
  });

  return NextResponse.json({
    asset: {
      id: asset.$id,
      name: file.name,
      file_type: file.type || "application/octet-stream",
      file_size: file.size,
      public_url: publicUrl,
      tags: typeof tag === "string" && tag ? [tag] : ["Uploaded"],
      created_at: asset.$createdAt,
    },
  });
}
