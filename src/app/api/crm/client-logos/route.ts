import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { clientLogos } from "@/db/schema";
import { asc } from "drizzle-orm";
import { revalidateClientLogo } from "@/lib/revalidate";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.select().from(clientLogos).orderBy(asc(clientLogos.order));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const [row] = await db.insert(clientLogos).values(body).returning();
  revalidateClientLogo();
  return NextResponse.json(row, { status: 201 });
}
