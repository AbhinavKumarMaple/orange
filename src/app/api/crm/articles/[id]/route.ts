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
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/articles/${row.slug}`);
  return NextResponse.json(row);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  // Fetch slug before deleting so we can revalidate the article page
  const [existing] = await db.select({ slug: articles.slug }).from(articles).where(eq(articles.id, Number(id))).limit(1);
  await db.delete(articles).where(eq(articles.id, Number(id)));
  revalidatePath("/");
  revalidatePath("/blog");
  if (existing?.slug) revalidatePath(`/articles/${existing.slug}`);
  return new NextResponse(null, { status: 204 });
}
