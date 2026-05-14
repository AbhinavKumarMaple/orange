import bcrypt from "bcryptjs";

/**
 * Password hashing utilities.
 *
 * - bcrypt with a work factor of 12 is the OWASP 2024+ recommended baseline
 *   for password storage. It's slow enough to make brute-force impractical
 *   yet fast enough not to add noticeable latency to sign-in.
 * - `bcryptjs` is the pure-JS implementation — runs identically in Node and
 *   in Edge runtimes (relevant if we later move auth verification into the
 *   proxy).
 * - Plain passwords MUST NEVER be logged, returned by an API, or persisted.
 *   Only `passwordHash` ever leaves this module.
 */

const WORK_FACTOR = 12;

/** Hash a plaintext password for storage. */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, WORK_FACTOR);
}

/** Constant-time verify a candidate password against a stored hash. */
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  if (!plain || !hash) return false;
  return bcrypt.compare(plain, hash);
}
