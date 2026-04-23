import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidateArticle } from "@/lib/revalidate";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const [existing] = await db.select({ slug: articles.slug }).from(articles).where(eq(articles.id, id)).limit(1);
  const [row] = await db
    .update(articles)
    .set(body)
    .where(eq(articles.id, id))
    .returning();
  // Revalidate both old slug (in case it changed) and new slug
  if (existing?.slug && existing.slug !== row?.slug) revalidateArticle(existing.slug);
  revalidateArticle(row?.slug);
  return NextResponse.json(row);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const [existing] = await db.select({ slug: articles.slug }).from(articles).where(eq(articles.id, id)).limit(1);
  await db.delete(articles).where(eq(articles.id, id));
  revalidateArticle(existing?.slug);
  return new NextResponse(null, { status: 204 });
}
