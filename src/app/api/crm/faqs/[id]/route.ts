import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { faqs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const [row] = await db
    .update(faqs)
    .set(body)
    .where(eq(faqs.id, Number(id)))
    .returning();
  revalidatePath("/", "layout");
  return NextResponse.json(row);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await db.delete(faqs).where(eq(faqs.id, Number(id)));
  revalidatePath("/", "layout");
  return new NextResponse(null, { status: 204 });
}
