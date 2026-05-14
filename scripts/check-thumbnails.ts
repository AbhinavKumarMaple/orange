import { config } from "dotenv";
config({ path: ".env.local" });

async function main() {
  const { neon } = await import("@neondatabase/serverless");
  const sql = neon(process.env.DATABASE_URL!);
  const rows = (await sql`
    SELECT url, thumbnail_url
    FROM media_assets
    WHERE url ILIKE '%.mp4' OR url ILIKE '%.webm' OR url ILIKE '%.mov'
    ORDER BY uploaded_at DESC
  `) as Array<{ url: string; thumbnail_url: string | null }>;
  console.log(`Total videos: ${rows.length}`);
  console.log(`With thumbnail:    ${rows.filter((r) => r.thumbnail_url).length}`);
  console.log(`Missing thumbnail: ${rows.filter((r) => !r.thumbnail_url).length}`);
  console.log("\nFirst 5:");
  for (const r of rows.slice(0, 5)) {
    console.log(`  ${r.url.split("/").pop()}`);
    console.log(`    -> ${r.thumbnail_url ? r.thumbnail_url.split("/").pop() : "(NULL)"}`);
  }
}
main().catch(console.error);
