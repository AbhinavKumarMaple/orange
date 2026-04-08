import { db } from "@/db";
import { heroContent } from "@/db/schema";
import HeroClient from "./HeroClient";

export const dynamic = "force-dynamic";

export default async function HeroPage() {
  const rows = await db.select().from(heroContent).limit(1);
  return <HeroClient initialData={rows[0] ?? null} />;
}
