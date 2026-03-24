import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { pricingPlans } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const [row] = await db
    .update(pricingPlans)
    .set(body)
    .where(eq(pricingPlans.id, Number(id)))
    .returning();
  revalidatePath("/");
  return NextResponse.json(row);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await db.delete(pricingPlans).where(eq(pricingPlans.id, Number(id)));
  revalidatePath("/");
  return new NextResponse(null, { status: 204 });
}
