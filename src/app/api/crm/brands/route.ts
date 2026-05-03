import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { brands } from "@/db/schema";
import { asc } from "drizzle-orm";
import { revalidateBrand } from "@/lib/revalidate";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.select().from(brands).orderBy(asc(brands.order));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const [row] = await db.insert(brands).values(body).returning();
  revalidateBrand();
  return NextResponse.json(row, { status: 201 });
}
