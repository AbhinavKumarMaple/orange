import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const [row] = await db
    .update(articles)
    .set(body)
    .where(eq(articles.id, Number(id)))
    .returning();
  revalidatePath("/", "layout");
  return NextResponse.json(row);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await db.delete(articles).where(eq(articles.id, Number(id)));
  revalidatePath("/", "layout");
  return new NextResponse(null, { status: 204 });
}
