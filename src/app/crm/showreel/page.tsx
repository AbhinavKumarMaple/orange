import { db } from "@/db";
import { showreelContent } from "@/db/schema";
import ShowreelClient from "./ShowreelClient";

export const dynamic = "force-dynamic";

export default async function ShowreelPage() {
    const rows = await db.select().from(showreelContent).limit(1);
    return <ShowreelClient initialData={rows[0] ?? null} />;
}
