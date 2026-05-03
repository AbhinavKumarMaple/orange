/**
 * One-time data fix: point the hero CTA to the contact anchor.
 * Only updates the row if it's still the legacy '#' placeholder so we
 * don't clobber a value the user has already customized.
 *
 * Run with: npx tsx scripts/update-hero-cta.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";

const db = drizzle(neon(process.env.DATABASE_URL!));

async function run() {
  console.log("Updating hero cta_href from '#' to '#Contact' (only if still placeholder)...");
  const result = await db.execute(sql`
    UPDATE "hero_content"
    SET "cta_href" = '#Contact'
    WHERE "cta_href" = '#'
    RETURNING "id"
  `);
  console.log(`Rows updated: ${result.rows.length}`);
  console.log("Default for new rows is now '#Contact'.");
}

run().catch(console.error);
