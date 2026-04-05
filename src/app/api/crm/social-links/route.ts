import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { socialLinks } from "@/db/schema";
import { asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.select().from(socialLinks).orderBy(asc(socialLinks.order));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const [row] = await db.insert(socialLinks).values(body).returning();
  revalidatePath("/");
  return NextResponse.json(row, { status: 201 });
}
