import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { whyUsContent } from "@/db/schema";
import { revalidateWhyUs } from "@/lib/revalidate";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.select().from(whyUsContent).limit(1);
  if (!rows.length) return NextResponse.json(null);
  return NextResponse.json(rows[0]);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const rows = await db.select({ id: whyUsContent.id }).from(whyUsContent).limit(1);

  let row;
  if (rows.length) {
    [row] = await db
      .update(whyUsContent)
      .set({ ...body, updatedAt: new Date() })
      .returning();
  } else {
    [row] = await db.insert(whyUsContent).values(body).returning();
  }

  revalidateWhyUs();
  return NextResponse.json(row);
}
