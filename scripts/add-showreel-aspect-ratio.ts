/**
 * One-time migration: add aspect_ratio column to showreel_content.
 * Run with: npx tsx scripts/add-showreel-aspect-ratio.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";

const db = drizzle(neon(process.env.DATABASE_URL!));

async function run() {
  console.log("Adding aspect_ratio column to showreel_content...");
  await db.execute(sql`
    ALTER TABLE "showreel_content"
    ADD COLUMN IF NOT EXISTS "aspect_ratio" text NOT NULL DEFAULT '1841/1050'
  `);
  console.log("Done.");
}

run().catch(console.error);
