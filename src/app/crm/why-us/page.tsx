import { db } from "@/db";
import { whyUsContent } from "@/db/schema";
import { getClientLogos } from "@/lib/queries";
import WhyUsClient from "./WhyUsClient";

export const dynamic = "force-dynamic";

export default async function WhyUsPage() {
    const [contentRows, logos] = await Promise.all([
        db.select().from(whyUsContent).limit(1),
        getClientLogos(),
    ]);
    return <WhyUsClient initialContent={contentRows[0] ?? null} initialLogos={logos} />;
}
