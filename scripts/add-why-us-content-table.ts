/**
 * One-time migration: create why_us_content table + seed the original
 * static label / heading / description / 4 stats so the page renders
 * unchanged until an editor saves new values via /crm/why-us.
 *
 * Run with: npx tsx scripts/add-why-us-content-table.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";

const db = drizzle(neon(process.env.DATABASE_URL!));

async function run() {
  console.log("Creating why_us_content table...");
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "why_us_content" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "label" text NOT NULL DEFAULT '//05 Why choose us',
      "heading" text NOT NULL DEFAULT 'Details make|the difference',
      "description" text NOT NULL DEFAULT 'We''re not just designers. We''re your partners who help you grow and get real results you can see.',
      "stat1_value" text NOT NULL DEFAULT '150+',
      "stat1_label" text NOT NULL DEFAULT 'Completed projects',
      "stat2_value" text NOT NULL DEFAULT '3.2x',
      "stat2_label" text NOT NULL DEFAULT 'Average ROI increase',
      "stat3_value" text NOT NULL DEFAULT '97%',
      "stat3_label" text NOT NULL DEFAULT 'Client satisfaction rate',
      "stat4_value" text NOT NULL DEFAULT '24hr',
      "stat4_label" text NOT NULL DEFAULT 'Average response time',
      "updated_at" timestamp DEFAULT now()
    )
  `);

  const existing = await db.execute(sql`SELECT id FROM why_us_content LIMIT 1`);
  if (existing.rows.length === 0) {
    console.log("Seeding initial why_us_content row...");
    await db.execute(sql`
      INSERT INTO "why_us_content" DEFAULT VALUES
    `);
    console.log("Seeded.");
  } else {
    console.log("Row already exists, skipping seed.");
  }

  console.log("Done.");
}

run().catch(console.error);
