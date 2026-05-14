import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

/**
 * Authentication boundary for the CRM.
 *
 * Protects:
 *   - /crm/*         (admin UI)
 *   - /api/crm/*     (admin data endpoints; mutations + the contact list)
 *
 * Everything else (homepage, blog, projects, contact form, articles,
 * sitemap, robots, OG images, RSS) stays public. The middleware only
 * inspects requests under the protected prefixes — every other path
 * returns immediately, costing nothing extra.
 *
 * For protected paths we read the session JWT from the HttpOnly cookie,
 * verify the signature + claims (issuer/audience/expiry), and:
 *   - Valid    -> let the request through
 *   - Invalid  -> for HTML, redirect to /sign-in with the original path as
 *                 `redirect_url`; for API routes, return JSON 401 so client
 *                 fetches can recognize an auth failure without parsing HTML
 *
 * We deliberately do NOT round-trip to the DB inside middleware — that's a
 * Server Component concern. JWT signature + expiry is enough to gate the
 * request; revocation (deleting a user row) is enforced in `getCurrentUser`
 * before any privileged action runs.
 */

function isProtected(pathname: string): boolean {
  return pathname.startsWith("/crm") || pathname.startsWith("/api/crm");
}

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (!isProtected(pathname)) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const claims = await verifySessionToken(token);
  if (claims) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const signInUrl = new URL("/sign-in", req.url);
  signInUrl.searchParams.set("redirect_url", pathname + search);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/crm/:path*", "/api/crm/:path*"],
};
