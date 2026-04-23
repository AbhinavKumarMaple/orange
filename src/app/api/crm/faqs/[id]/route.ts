import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { faqs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidateFaq } from "@/lib/revalidate";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const [row] = await db
    .update(faqs)
    .set(body)
    .where(eq(faqs.id, id))
    .returning();
  revalidateFaq();
  return NextResponse.json(row);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await db.delete(faqs).where(eq(faqs.id, id));
  revalidateFaq();
  return new NextResponse(null, { status: 204 });
}
