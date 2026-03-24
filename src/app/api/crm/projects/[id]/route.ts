import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const [row] = await db
    .update(projects)
    .set(body)
    .where(eq(projects.id, Number(id)))
    .returning();
  revalidatePath("/");
  revalidatePath(`/projects/${row.slug}`);
  return NextResponse.json(row);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const [existing] = await db.select({ slug: projects.slug }).from(projects).where(eq(projects.id, Number(id))).limit(1);
  await db.delete(projects).where(eq(projects.id, Number(id)));
  revalidatePath("/");
  if (existing?.slug) revalidatePath(`/projects/${existing.slug}`);
  return new NextResponse(null, { status: 204 });
}
