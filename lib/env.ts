import "server-only";
import { getPublicEnv } from "./env-public";

export function getServerEnv() {
  const publicEnv = getPublicEnv();
  const projectId = process.env.APPWRITE_PROJECT_ID ?? "";

  return {
    ...publicEnv,
    appwriteEndpoint: process.env.APPWRITE_ENDPOINT ?? "",
    appwriteProjectId: projectId,
    appwriteApiKey: process.env.APPWRITE_API_KEY ?? "",
    appwriteDatabaseId: process.env.APPWRITE_DATABASE_ID ?? "gridpost_ai",
    appwriteStorageBucketId: process.env.APPWRITE_STORAGE_BUCKET_ID ?? "media",
    appwriteCookieName: process.env.APPWRITE_COOKIE_NAME || (projectId ? `a_session_${projectId}` : "gridpost_session"),
    openaiApiKey: process.env.OPENAI_API_KEY ?? "",
    openaiModel: process.env.OPENAI_MODEL ?? "gpt-5.5",
    resendApiKey: process.env.RESEND_API_KEY ?? "",
    resendFromEmail: process.env.RESEND_FROM_EMAIL ?? "GridPost AI <onboarding@resend.dev>",
    resendNotifyEmail: process.env.RESEND_NOTIFY_EMAIL ?? "",
  };
}

export function requireServerEnv(name: keyof ReturnType<typeof getServerEnv>) {
  const env = getServerEnv();
  const value = env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${String(name)}`);
  }

  return value;
}

export function assertAppwriteEnv() {
  const env = getServerEnv();

  if (!env.appwriteEndpoint || !env.appwriteProjectId) {
    throw new Error("Missing Appwrite env values. Set APPWRITE_ENDPOINT and APPWRITE_PROJECT_ID in .env.local.");
  }

  return env;
}

export function assertAppwriteAdminEnv() {
  const env = assertAppwriteEnv();

  if (!env.appwriteApiKey) {
    throw new Error("Missing APPWRITE_API_KEY. Create a server API key in Appwrite Console and add it to .env.local.");
  }

  return env;
}
