import "server-only";

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { getServerEnv } from "@/lib/env";

const VERSION = "gpa1";

function getKey() {
  const env = getServerEnv();
  const secret = process.env.TOKEN_ENCRYPTION_KEY || env.appwriteApiKey || env.appwriteProjectId;

  if (!secret) {
    throw new Error("Missing token encryption secret. Set TOKEN_ENCRYPTION_KEY or APPWRITE_API_KEY.");
  }

  return createHash("sha256").update(secret).digest();
}

export function encryptToken(value: string) {
  if (!value) return "";

  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [VERSION, iv.toString("base64url"), tag.toString("base64url"), encrypted.toString("base64url")].join(".");
}

export function decryptToken(value: string) {
  if (!value) return "";

  const [version, iv, tag, encrypted] = value.split(".");
  if (version !== VERSION || !iv || !tag || !encrypted) {
    throw new Error("Invalid encrypted token format.");
  }

  const decipher = createDecipheriv("aes-256-gcm", getKey(), Buffer.from(iv, "base64url"));
  decipher.setAuthTag(Buffer.from(tag, "base64url"));

  return Buffer.concat([
    decipher.update(Buffer.from(encrypted, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}
