import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { services } from "@/db/schema";
import { asc } from "drizzle-orm";
import { revalidateService } from "@/lib/revalidate";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.select().from(services).orderBy(asc(services.order));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const [row] = await db.insert(services).values(body).returning();
  revalidateService();
  return NextResponse.json(row, { status: 201 });
}
