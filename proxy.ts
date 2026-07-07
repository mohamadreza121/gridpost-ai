import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const projectId = process.env.APPWRITE_PROJECT_ID ?? "";
  const cookieName = process.env.APPWRITE_COOKIE_NAME || (projectId ? `a_session_${projectId}` : "gridpost_session");
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  const hasSession = Boolean(request.cookies.get(cookieName)?.value);

  if (isDashboard && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
