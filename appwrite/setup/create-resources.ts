// @ts-nocheck
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { Client, Databases, Permission, Role, Storage } from "node-appwrite";

function loadLocalEnv() {
  for (const filename of [".env.local", ".env"]) {
    const filepath = resolve(process.cwd(), filename);
    if (!existsSync(filepath)) continue;

    const content = readFileSync(filepath, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const [key, ...rest] = trimmed.split("=");
      const value = rest.join("=").trim().replace(/^['\"]|['\"]$/g, "");
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

loadLocalEnv();

const endpoint = process.env.APPWRITE_ENDPOINT;
const projectId = process.env.APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.APPWRITE_DATABASE_ID || "gridpost_ai";
const bucketId = process.env.APPWRITE_STORAGE_BUCKET_ID || "media";

if (!endpoint || !projectId || !apiKey) {
  throw new Error("Missing APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, or APPWRITE_API_KEY in .env.local.");
}

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const databases = new Databases(client);
const storage = new Storage(client);

async function ignoreExists<T>(label: string, action: () => Promise<T>) {
  try {
    const result = await action();
    console.log(`created ${label}`);
    return result;
  } catch (error: any) {
    if (error?.code === 409 || String(error?.message ?? "").toLowerCase().includes("already exists")) {
      console.log(`exists  ${label}`);
      return null;
    }
    throw error;
  }
}

async function wait(ms = 350) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

type Attribute =
  | { type: "string"; key: string; size: number; required?: boolean; array?: boolean; default?: string | string[] }
  | { type: "integer"; key: string; required?: boolean; array?: boolean }
  | { type: "boolean"; key: string; required?: boolean; array?: boolean }
  | { type: "datetime"; key: string; required?: boolean; array?: boolean };

type CollectionDefinition = {
  id: string;
  name: string;
  attributes: Attribute[];
  indexes?: { key: string; type: "key" | "fulltext" | "unique"; attributes: string[]; orders?: ("ASC" | "DESC")[] }[];
};

const collections: CollectionDefinition[] = [
  {
    id: "workspaces",
    name: "Workspaces",
    attributes: [
      { type: "string", key: "name", size: 160, required: true },
      { type: "string", key: "owner_id", size: 64, required: true },
    ],
    indexes: [{ key: "owner_id_idx", type: "key", attributes: ["owner_id"] }],
  },
  {
    id: "workspace_members",
    name: "Workspace Members",
    attributes: [
      { type: "string", key: "workspace_id", size: 64, required: true },
      { type: "string", key: "user_id", size: 64, required: true },
      { type: "string", key: "role", size: 32, required: true },
    ],
    indexes: [
      { key: "user_id_idx", type: "key", attributes: ["user_id"] },
      { key: "workspace_id_idx", type: "key", attributes: ["workspace_id"] },
    ],
  },
  {
    id: "brand_profiles",
    name: "Brand Profiles",
    attributes: [
      { type: "string", key: "workspace_id", size: 64, required: true },
      { type: "string", key: "brand_name", size: 160, required: true },
      { type: "string", key: "voice", size: 2000, required: false },
      { type: "string", key: "audience", size: 1000, required: false },
      { type: "string", key: "default_hashtags", size: 80, required: false, array: true },
      { type: "string", key: "default_cta", size: 400, required: false },
    ],
    indexes: [{ key: "workspace_id_idx", type: "key", attributes: ["workspace_id"] }],
  },
  {
    id: "social_accounts",
    name: "Social Accounts",
    attributes: [
      { type: "string", key: "workspace_id", size: 64, required: true },
      { type: "string", key: "platform", size: 32, required: true },
      { type: "string", key: "display_name", size: 160, required: false },
      { type: "string", key: "status", size: 32, required: true },
      { type: "string", key: "config", size: 5000, required: false },
    ],
    indexes: [{ key: "workspace_id_idx", type: "key", attributes: ["workspace_id"] }],
  },
  {
    id: "media_assets",
    name: "Media Assets",
    attributes: [
      { type: "string", key: "workspace_id", size: 64, required: true },
      { type: "string", key: "uploaded_by", size: 64, required: true },
      { type: "string", key: "name", size: 255, required: true },
      { type: "string", key: "file_type", size: 120, required: true },
      { type: "integer", key: "file_size", required: true },
      { type: "string", key: "storage_bucket", size: 120, required: true },
      { type: "string", key: "storage_path", size: 255, required: true },
      { type: "string", key: "public_url", size: 1000, required: false },
      { type: "string", key: "tags", size: 80, required: false, array: true },
    ],
    indexes: [{ key: "workspace_id_idx", type: "key", attributes: ["workspace_id"] }],
  },
  {
    id: "posts",
    name: "Posts",
    attributes: [
      { type: "string", key: "workspace_id", size: 64, required: true },
      { type: "string", key: "created_by", size: 64, required: true },
      { type: "string", key: "title", size: 255, required: true },
      { type: "string", key: "base_caption", size: 5000, required: true },
      { type: "string", key: "status", size: 32, required: true },
      { type: "datetime", key: "scheduled_at", required: false },
      { type: "string", key: "timezone", size: 80, required: false },
      { type: "string", key: "repeat_rule", size: 80, required: false },
      { type: "datetime", key: "published_at", required: false },
    ],
    indexes: [
      { key: "workspace_id_idx", type: "key", attributes: ["workspace_id"] },
      { key: "status_idx", type: "key", attributes: ["status"] },
      { key: "scheduled_at_idx", type: "key", attributes: ["scheduled_at"] },
    ],
  },
  {
    id: "post_platforms",
    name: "Post Platforms",
    attributes: [
      { type: "string", key: "post_id", size: 64, required: true },
      { type: "string", key: "workspace_id", size: 64, required: true },
      { type: "string", key: "platform", size: 32, required: true },
      { type: "string", key: "caption", size: 5000, required: true },
      { type: "string", key: "status", size: 32, required: true },
      { type: "datetime", key: "published_at", required: false },
    ],
    indexes: [
      { key: "workspace_id_idx", type: "key", attributes: ["workspace_id"] },
      { key: "post_id_idx", type: "key", attributes: ["post_id"] },
    ],
  },
  {
    id: "publish_jobs",
    name: "Publish Jobs",
    attributes: [
      { type: "string", key: "workspace_id", size: 64, required: true },
      { type: "string", key: "post_id", size: 64, required: true },
      { type: "string", key: "status", size: 32, required: true },
      { type: "datetime", key: "run_at", required: true },
      { type: "datetime", key: "started_at", required: false },
      { type: "datetime", key: "completed_at", required: false },
      { type: "string", key: "error_message", size: 2000, required: false },
    ],
    indexes: [
      { key: "status_idx", type: "key", attributes: ["status"] },
      { key: "run_at_idx", type: "key", attributes: ["run_at"] },
      { key: "post_id_idx", type: "key", attributes: ["post_id"] },
    ],
  },
  {
    id: "publish_results",
    name: "Publish Results",
    attributes: [
      { type: "string", key: "workspace_id", size: 64, required: true },
      { type: "string", key: "post_id", size: 64, required: true },
      { type: "string", key: "post_platform_id", size: 64, required: true },
      { type: "string", key: "platform", size: 32, required: true },
      { type: "string", key: "status", size: 32, required: true },
      { type: "string", key: "external_url", size: 1000, required: false },
      { type: "string", key: "response", size: 5000, required: false },
    ],
    indexes: [{ key: "post_id_idx", type: "key", attributes: ["post_id"] }],
  },
  {
    id: "automation_rules",
    name: "Automation Rules",
    attributes: [
      { type: "string", key: "workspace_id", size: 64, required: true },
      { type: "string", key: "rule_type", size: 100, required: true },
      { type: "boolean", key: "enabled", required: true },
      { type: "string", key: "config", size: 5000, required: false },
    ],
    indexes: [{ key: "workspace_id_idx", type: "key", attributes: ["workspace_id"] }],
  },
  {
    id: "agent_events",
    name: "Agent Events",
    attributes: [
      { type: "string", key: "event_type", size: 120, required: true },
      { type: "string", key: "payload", size: 5000, required: false },
    ],
    indexes: [{ key: "event_type_idx", type: "key", attributes: ["event_type"] }],
  },
];

async function createAttribute(collectionId: string, attr: Attribute) {
  const label = `${collectionId}.${attr.key}`;
  await ignoreExists(label, async () => {
    if (attr.type === "string") {
      return databases.createStringAttribute({
        databaseId,
        collectionId,
        key: attr.key,
        size: attr.size,
        required: Boolean(attr.required),
        array: Boolean(attr.array),
        default: attr.default as any,
      });
    }

    if (attr.type === "integer") {
      return databases.createIntegerAttribute({
        databaseId,
        collectionId,
        key: attr.key,
        required: Boolean(attr.required),
        array: Boolean(attr.array),
      });
    }

    if (attr.type === "boolean") {
      return databases.createBooleanAttribute({
        databaseId,
        collectionId,
        key: attr.key,
        required: Boolean(attr.required),
        array: Boolean(attr.array),
      });
    }

    return databases.createDatetimeAttribute({
      databaseId,
      collectionId,
      key: attr.key,
      required: Boolean(attr.required),
      array: Boolean(attr.array),
    });
  });
  await wait();
}

async function main() {
  await ignoreExists(`database ${databaseId}`, () => databases.create({ databaseId, name: "GridPost AI" }));

  await ignoreExists(`bucket ${bucketId}`, () => storage.createBucket({
    bucketId,
    name: "GridPost Media",
    permissions: [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ],
    fileSecurity: false,
    enabled: true,
    maximumFileSize: 100 * 1024 * 1024,
    allowedFileExtensions: ["jpg", "jpeg", "png", "webp", "gif", "mp4", "mov", "webm"],
  }));

  for (const collection of collections) {
    await ignoreExists(`collection ${collection.id}`, () => databases.createCollection({
      databaseId,
      collectionId: collection.id,
      name: collection.name,
      permissions: [
        Permission.read(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ],
      documentSecurity: false,
      enabled: true,
    }));

    for (const attr of collection.attributes) {
      await createAttribute(collection.id, attr);
    }

    await wait(1500);

    for (const index of collection.indexes ?? []) {
      await ignoreExists(`${collection.id}.${index.key}`, () => databases.createIndex({
        databaseId,
        collectionId: collection.id,
        key: index.key,
        type: index.type,
        attributes: index.attributes,
        orders: index.orders,
      }));
      await wait(250);
    }
  }

  console.log("\nAppwrite resources are ready.");
  console.log(`Database: ${databaseId}`);
  console.log(`Bucket:   ${bucketId}`);
}

main().catch((error) => {
  console.error("Appwrite setup failed:");
  console.error(error);
  process.exit(1);
});
