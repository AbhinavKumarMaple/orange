import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { brands } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidateBrand } from "@/lib/revalidate";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const [row] = await db
    .update(brands)
    .set(body)
    .where(eq(brands.id, id))
    .returning();
  revalidateBrand();
  return NextResponse.json(row);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await db.delete(brands).where(eq(brands.id, id));
  revalidateBrand();
  return new NextResponse(null, { status: 204 });
}
