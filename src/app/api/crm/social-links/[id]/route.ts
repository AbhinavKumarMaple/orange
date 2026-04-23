import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { socialLinks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidateSocialLinks } from "@/lib/revalidate";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const [row] = await db
    .update(socialLinks)
    .set(body)
    .where(eq(socialLinks.id, id))
    .returning();
  revalidateSocialLinks();
  return NextResponse.json(row);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await db.delete(socialLinks).where(eq(socialLinks.id, id));
  revalidateSocialLinks();
  return new NextResponse(null, { status: 204 });
}
