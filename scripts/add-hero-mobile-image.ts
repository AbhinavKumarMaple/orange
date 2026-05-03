/**
 * One-time migration: add mobile_image column to hero_content.
 * Run with: npx tsx scripts/add-hero-mobile-image.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";

const db = drizzle(neon(process.env.DATABASE_URL!));

async function run() {
  console.log("Adding mobile_image column to hero_content...");
  await db.execute(sql`
    ALTER TABLE "hero_content"
    ADD COLUMN IF NOT EXISTS "mobile_image" text NOT NULL DEFAULT ''
  `);
  console.log("Done.");
}

run().catch(console.error);
