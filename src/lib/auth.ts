import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { db } from "@/db";
import { crmUsers } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Authentication core: JWT session tokens stored in an HttpOnly cookie.
 *
 * Token shape (claims):
 *   sub   - crmUsers.id (UUID)
 *   email - the user's email (denormalized so middleware can decide without
 *           a DB hit; the source of truth is still the crm_users row)
 *   iat   - issued-at (jose default)
 *   exp   - expiry, SESSION_DURATION_SECONDS after iat
 *
 * Cookie:
 *   name      - SESSION_COOKIE_NAME
 *   value     - the signed JWT
 *   HttpOnly  - true (JS in the page cannot read or steal it)
 *   Secure    - true in production over HTTPS, false locally so dev works
 *   SameSite  - "lax" (allows top-level GET navigation while blocking
 *               cross-site POST CSRF on protected mutations)
 *   Path      - "/" (proxy middleware needs to see it on every route)
 *   Max-Age   - SESSION_DURATION_SECONDS
 */

export const SESSION_COOKIE_NAME = "orange_session";
export const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

const JWT_ISSUER = "orange-studios";
const JWT_AUDIENCE = "orange-studios-crm";

export interface SessionClaims extends JWTPayload {
  sub: string;
  email: string;
}

function getSigningKey(): Uint8Array {
  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_JWT_SECRET is missing or too short. Set a 32+ byte secret in .env.local.",
    );
  }
  return new TextEncoder().encode(secret);
}

/** Build a signed HS256 JWT for a CRM user session. */
export async function signSessionToken(claims: { sub: string; email: string }): Promise<string> {
  return new SignJWT(claims)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSigningKey());
}

/** Verify a JWT. Returns null if invalid/expired/wrong issuer-audience. */
export async function verifySessionToken(token: string | undefined): Promise<SessionClaims | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSigningKey(), {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      algorithms: ["HS256"],
    });
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") return null;
    return payload as SessionClaims;
  } catch {
    return null;
  }
}

/**
 * Server Component / Server Action helper.
 *
 * Reads the session cookie, verifies the JWT, then confirms the user row
 * still exists in `crm_users`. Returns null if the session is missing,
 * tampered with, expired, or points at a user that was removed (effectively
 * a server-side revocation path).
 */
export async function getCurrentUser(): Promise<{ id: string; email: string } | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE_NAME)?.value;
  const claims = await verifySessionToken(token);
  if (!claims) return null;

  const [row] = await db
    .select({ id: crmUsers.id, email: crmUsers.email })
    .from(crmUsers)
    .where(eq(crmUsers.id, claims.sub))
    .limit(1);

  return row ?? null;
}

export function buildSessionCookie(token: string) {
  return {
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  };
}

export function buildSignOutCookie() {
  return {
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}
