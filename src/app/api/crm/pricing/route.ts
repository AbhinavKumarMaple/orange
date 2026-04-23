import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { pricingPlans } from "@/db/schema";
import { asc } from "drizzle-orm";
import { revalidatePricing } from "@/lib/revalidate";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db
    .select()
    .from(pricingPlans)
    .orderBy(asc(pricingPlans.order));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const [row] = await db.insert(pricingPlans).values(body).returning();
  revalidatePricing();
  return NextResponse.json(row, { status: 201 });
}
