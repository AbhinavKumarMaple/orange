/**
 * One-time migration: old DB (serial IDs) → new DB (UUID IDs).
 * Clears new tables first, strips old IDs, skips test/junk projects.
 */

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import * as schema from "../src/db/schema";

const OLD_DB_URL =
  "postgresql://default:cjhlTm7ryiz3@ep-shy-math-70561296-pooler.ap-southeast-1.aws.neon.tech/verceldb?sslmode=require&channel_binding=require";
const NEW_DB_URL =
  "postgresql://neondb_owner:npg_2d0yzXVoQpLJ@ep-hidden-pine-a1g1lw6x-pooler.ap-southeast-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require";

const oldDb = drizzle(neon(OLD_DB_URL), { schema });
const newDb = drizzle(neon(NEW_DB_URL), { schema });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function stripId(rows: any[]) {
  return rows.map(({ id, ...rest }) => rest);
}

// Junk test slugs to skip
const SKIP_SLUGS = new Set(["OMG", "hfghfh", "slug", "fsdfsdf"]);

async function migrate() {
  // Clear new tables first
  console.log("Clearing new tables...");
  await newDb.execute(sql`TRUNCATE projects, articles, testimonials, faqs, services, pricing_plans, contact_submissions`);

  console.log("Reading from old database...");
  const [projects, articles, testimonials, faqs, services, pricingPlans, contactSubmissions] =
    await Promise.all([
      oldDb.select().from(schema.projects),
      oldDb.select().from(schema.articles),
      oldDb.select().from(schema.testimonials),
      oldDb.select().from(schema.faqs),
      oldDb.select().from(schema.services),
      oldDb.select().from(schema.pricingPlans),
      oldDb.select().from(schema.contactSubmissions),
    ]);

  // Filter out junk projects
  const cleanProjects = projects.filter((p) => !SKIP_SLUGS.has(p.slug));

  console.log("Writing to new database...");

  if (cleanProjects.length > 0) {
    await newDb.insert(schema.projects).values(stripId(cleanProjects));
    console.log(`  ✓ ${cleanProjects.length} projects (skipped ${projects.length - cleanProjects.length} junk)`);
  }
  if (articles.length > 0) {
    await newDb.insert(schema.articles).values(stripId(articles));
    console.log(`  ✓ ${articles.length} articles`);
  }
  if (testimonials.length > 0) {
    await newDb.insert(schema.testimonials).values(stripId(testimonials));
    console.log(`  ✓ ${testimonials.length} testimonials`);
  }
  if (faqs.length > 0) {
    await newDb.insert(schema.faqs).values(stripId(faqs));
    console.log(`  ✓ ${faqs.length} faqs`);
  }
  if (services.length > 0) {
    await newDb.insert(schema.services).values(stripId(services));
    console.log(`  ✓ ${services.length} services`);
  }
  if (pricingPlans.length > 0) {
    await newDb.insert(schema.pricingPlans).values(stripId(pricingPlans));
    console.log(`  ✓ ${pricingPlans.length} pricing plans`);
  }
  if (contactSubmissions.length > 0) {
    await newDb.insert(schema.contactSubmissions).values(stripId(contactSubmissions));
    console.log(`  ✓ ${contactSubmissions.length} contact submissions`);
  }

  console.log("✅ Done!");
}

migrate().catch((err) => {
  console.error("❌ Failed:", err.message || err);
  process.exit(1);
});
