/**
 * scripts/create-crm-user.ts
 *
 * Add a new CRM operator (allowlist entry) or reset an existing operator's
 * password. There is intentionally NO API or UI for this — every user that
 * can sign in must be created here by an admin with database access.
 *
 * Usage:
 *   npm run auth:create-user -- <email> <password>
 *   npm run auth:create-user -- orangesssstudios@gmail.com 'SomeStrongPassword!'
 *
 * Notes:
 *   - Wrap passwords containing special shell characters in double quotes
 *     on Windows (cmd) or single quotes on POSIX shells.
 *   - If the email already exists, its passwordHash is updated in place
 *     (effectively a password reset). No other fields are touched.
 *   - Emails are stored lowercased and trimmed.
 *   - Password is bcrypt-hashed before insert; the plaintext is never
 *     logged or persisted.
 *
 * Implementation detail: `db` and its dependencies are loaded via dynamic
 * import AFTER dotenv populates process.env. Doing it as a top-level static
 * import would cause `@neondatabase/serverless` to throw "No database
 * connection string" because ES module imports are hoisted and would run
 * before `loadEnv()` has had a chance to set DATABASE_URL.
 */

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

function fail(msg: string): never {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function main() {
  const [, , rawEmail, password] = process.argv;

  if (!rawEmail || !password) {
    fail(
      "Usage: npm run auth:create-user -- <email> <password>\n" +
        "  Example: npm run auth:create-user -- orangesssstudios@gmail.com \"StrongPass!2026\"",
    );
  }

  const email = rawEmail.toLowerCase().trim();
  if (!isValidEmail(email)) fail(`Invalid email: ${rawEmail}`);
  if (password.length < 12) fail("Password must be at least 12 characters long.");

  if (!process.env.DATABASE_URL) {
    fail(
      "DATABASE_URL is not set. Make sure .env.local exists and is loaded.\n" +
        "  Expected key: DATABASE_URL=postgresql://...",
    );
  }

  // Dynamic-import the DB-touching modules so loadEnv() above has populated
  // process.env before `@neondatabase/serverless` reads DATABASE_URL.
  const { eq } = await import("drizzle-orm");
  const { db } = await import("../src/db");
  const { crmUsers } = await import("../src/db/schema");
  const { hashPassword } = await import("../src/lib/password");

  const passwordHash = await hashPassword(password);

  const [existing] = await db
    .select({ id: crmUsers.id })
    .from(crmUsers)
    .where(eq(crmUsers.email, email))
    .limit(1);

  if (existing) {
    await db
      .update(crmUsers)
      .set({ passwordHash })
      .where(eq(crmUsers.id, existing.id));
    console.log(`✔ Password reset for existing user: ${email}`);
  } else {
    const [created] = await db
      .insert(crmUsers)
      .values({ email, passwordHash })
      .returning({ id: crmUsers.id, email: crmUsers.email });
    console.log(`✔ Created new CRM user: ${created.email} (id=${created.id})`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error("\n✖ Unexpected error:");
  console.error(err);
  process.exit(1);
});
