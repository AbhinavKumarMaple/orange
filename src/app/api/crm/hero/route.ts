import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { heroContent } from "@/db/schema";
import { revalidateHero } from "@/lib/revalidate";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.select().from(heroContent).limit(1);
  if (!rows.length) return NextResponse.json(null);
  return NextResponse.json(rows[0]);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const rows = await db.select({ id: heroContent.id }).from(heroContent).limit(1);

  let row;
  if (rows.length) {
    [row] = await db
      .update(heroContent)
      .set({ ...body, updatedAt: new Date() })
      .returning();
  } else {
    [row] = await db.insert(heroContent).values(body).returning();
  }

  revalidateHero();
  return NextResponse.json(row);
}
