/**
 * One-time migration: create client_logos table for the //05 Why Choose Us
 * grid. Seeds the four existing static logos so the page renders identically
 * until an editor adds/removes via /crm/client-logos.
 *
 * Run with: npx tsx scripts/add-client-logos-table.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";

const db = drizzle(neon(process.env.DATABASE_URL!));

async function run() {
  console.log("Creating client_logos table...");
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "client_logos" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "name" text NOT NULL,
      "image" text NOT NULL,
      "width" integer NOT NULL DEFAULT 200,
      "height" integer NOT NULL DEFAULT 60,
      "order" integer NOT NULL DEFAULT 0
    )
  `);

  const existing = await db.execute(sql`SELECT id FROM client_logos LIMIT 1`);
  if (existing.rows.length === 0) {
    console.log("Seeding original 4 client logos...");
    await db.execute(sql`
      INSERT INTO "client_logos" ("name", "image", "width", "height", "order") VALUES
        ('Velo Studio', 'https://framerusercontent.com/images/awDtj7rqkXF0BCm12jsm7BzLczg.svg', 120, 40, 1),
        ('Urban Bites', 'https://framerusercontent.com/images/zUJMCCKSzjR4tLQ8amSnfss8UUA.svg', 120, 40, 2),
        ('Baseline Sports', 'https://framerusercontent.com/images/faK3uVL6HKHj0lUYRZh2fWmn3o.svg', 120, 40, 3),
        ('Northcap Supply', 'https://framerusercontent.com/images/NwlOGrknUmkPlpa4MVL7oF0w48Q.svg', 120, 40, 4)
    `);
    console.log("Seeded 4 client logos.");
  } else {
    console.log("Client logos already exist, skipping seed.");
  }
  console.log("Done.");
}

run().catch(console.error);
