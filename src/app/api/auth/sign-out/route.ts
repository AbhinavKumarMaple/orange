import { NextResponse } from "next/server";
import { buildSignOutCookie } from "@/lib/auth";

/**
 * Sign-out endpoint.
 *
 *   POST /api/auth/sign-out
 *
 * Clears the session cookie by setting its Max-Age to 0. The client is
 * responsible for navigating to /sign-in after this returns.
 *
 * POST-only (not GET) so that someone embedding a `/api/auth/sign-out`
 * image or link cannot CSRF the user into logging out.
 */
export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(buildSignOutCookie());
  return res;
}
