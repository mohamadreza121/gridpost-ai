import { randomUUID } from "node:crypto";
import { getSocialPlatform } from "./platforms";

export function buildOAuthState(params: { workspaceId: string; platform: string; returnTo?: string }) {
  return Buffer.from(JSON.stringify({ ...params, nonce: randomUUID() }), "utf8").toString("base64url");
}

export function readOAuthState(value: string) {
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as {
      workspaceId?: string;
      platform?: string;
      returnTo?: string;
      nonce?: string;
    };
  } catch {
    return null;
  }
}

export function getProviderEnv(platform: string) {
  const upper = platform.toUpperCase();
  return {
    clientId: process.env[`${upper}_CLIENT_ID`] ?? "",
    clientSecret: process.env[`${upper}_CLIENT_SECRET`] ?? "",
    redirectUri: process.env[`${upper}_REDIRECT_URI`] ?? "",
  };
}

export function getOAuthReadiness(platform: string) {
  const definition = getSocialPlatform(platform);
  const env = getProviderEnv(platform);

  return {
    platform,
    label: definition?.label ?? platform,
    configured: Boolean(env.clientId && env.clientSecret && env.redirectUri),
    missing: [
      env.clientId ? null : `${platform.toUpperCase()}_CLIENT_ID`,
      env.clientSecret ? null : `${platform.toUpperCase()}_CLIENT_SECRET`,
      env.redirectUri ? null : `${platform.toUpperCase()}_REDIRECT_URI`,
    ].filter(Boolean) as string[],
  };
}
