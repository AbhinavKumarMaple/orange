import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidateTestimonial } from "@/lib/revalidate";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const [row] = await db
    .update(testimonials)
    .set(body)
    .where(eq(testimonials.id, id))
    .returning();
  revalidateTestimonial();
  return NextResponse.json(row);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await db.delete(testimonials).where(eq(testimonials.id, id));
  revalidateTestimonial();
  return new NextResponse(null, { status: 204 });
}
