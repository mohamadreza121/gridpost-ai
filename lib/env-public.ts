export function getPublicEnv() {
  return {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    appName: process.env.NEXT_PUBLIC_APP_NAME ?? "GridPost AI",
  };
}
