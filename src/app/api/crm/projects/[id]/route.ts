import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidateProject } from "@/lib/revalidate";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const [existing] = await db.select({ slug: projects.slug }).from(projects).where(eq(projects.id, id)).limit(1);
  const [row] = await db
    .update(projects)
    .set(body)
    .where(eq(projects.id, id))
    .returning();
  if (existing?.slug && existing.slug !== row?.slug) revalidateProject(existing.slug);
  revalidateProject(row?.slug);
  return NextResponse.json(row);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const [existing] = await db.select({ slug: projects.slug }).from(projects).where(eq(projects.id, id)).limit(1);
  await db.delete(projects).where(eq(projects.id, id));
  revalidateProject(existing?.slug);
  return new NextResponse(null, { status: 204 });
}
