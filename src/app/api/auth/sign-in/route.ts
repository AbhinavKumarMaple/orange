import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { crmUsers } from "@/db/schema";
import { verifyPassword } from "@/lib/password";
import {
  signSessionToken,
  buildSessionCookie,
  SESSION_DURATION_SECONDS,
} from "@/lib/auth";

/**
 * Sign-in endpoint.
 *
 *   POST /api/auth/sign-in
 *   Body: { email, password }
 *
 * On success, sets the HttpOnly session cookie and returns 200 with the
 * destination path so the client can navigate. We never include the JWT in
 * the response body — the cookie is the entire auth surface.
 *
 * On failure, return a generic "Invalid email or password" so the response
 * doesn't leak whether the email exists. Same status (401) for both
 * unknown-email and wrong-password.
 */

export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(256),
  redirectTo: z.string().optional(),
});

function sanitizeRedirectTo(value: string | undefined): string {
  if (!value) return "/crm";
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  return "/crm";
}

export async function POST(req: NextRequest) {
  let parsed;
  try {
    parsed = schema.parse(await req.json());
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", fields: err.flatten().fieldErrors },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Malformed request" }, { status: 400 });
  }

  const email = parsed.email.toLowerCase().trim();
  const [user] = await db
    .select()
    .from(crmUsers)
    .where(eq(crmUsers.email, email))
    .limit(1);

  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const ok = await verifyPassword(parsed.password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  // Record last sign-in time for audit purposes. Failure here shouldn't block
  // the actual sign-in, so swallow any error.
  try {
    await db
      .update(crmUsers)
      .set({ lastSignInAt: new Date() })
      .where(eq(crmUsers.id, user.id));
  } catch {
    /* non-fatal */
  }

  const token = await signSessionToken({ sub: user.id, email: user.email });
  const redirectTo = sanitizeRedirectTo(parsed.redirectTo);

  const res = NextResponse.json({ ok: true, redirectTo });
  res.cookies.set(buildSessionCookie(token));
  // Belt-and-suspenders: also signal session lifetime via header so clients
  // that ignore the body still know when to expect re-auth.
  res.headers.set("X-Session-Max-Age", String(SESSION_DURATION_SECONDS));
  return res;
}
