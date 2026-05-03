/**
 * One-time migration: create showreel_content table and seed initial row.
 * Run with: npx tsx scripts/add-showreel-table.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";

const db = drizzle(neon(process.env.DATABASE_URL!));

async function run() {
  console.log("Creating showreel_content table...");
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "showreel_content" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "label" text NOT NULL DEFAULT '//02 Showreel',
      "heading" text NOT NULL DEFAULT E'See Our Work\nIn Motion',
      "description" text NOT NULL DEFAULT 'Experience a fast showcase of our best projects, highlighting bold design, seamless strategy, and measurable impact.',
      "video" text NOT NULL DEFAULT '',
      "updated_at" timestamp DEFAULT now()
    )
  `);

  const existing = await db.execute(sql`SELECT id FROM showreel_content LIMIT 1`);
  if (existing.rows.length === 0) {
    console.log("Seeding initial showreel row...");
    await db.execute(sql`
      INSERT INTO "showreel_content" ("label", "heading", "description", "video")
      VALUES (
        '//02 Showreel',
        E'See Our Work\nIn Motion',
        'Experience a fast showcase of our best projects, highlighting bold design, seamless strategy, and measurable impact.',
        'https://framerusercontent.com/assets/3BDoGQqUun8oJGATqjDVryyVGRc.mp4'
      )
    `);
    console.log("Seeded.");
  } else {
    console.log("Row already exists, skipping seed.");
  }

  console.log("Done.");
}

run().catch(console.error);
