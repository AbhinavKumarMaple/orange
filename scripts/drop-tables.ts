import { neon } from "@neondatabase/serverless";

const sql = neon("postgresql://neondb_owner:npg_2d0yzXVoQpLJ@ep-hidden-pine-a1g1lw6x-pooler.ap-southeast-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require");

async function drop() {
  const tables = [
    "projects", "articles", "testimonials",
    "faqs", "services", "pricing_plans", "contact_submissions",
  ];
  for (const t of tables) {
    await sql.query(`DROP TABLE IF EXISTS "${t}" CASCADE`);
    console.log(`✓ dropped ${t}`);
  }
  console.log("Done.");
}

drop().catch(console.error);
