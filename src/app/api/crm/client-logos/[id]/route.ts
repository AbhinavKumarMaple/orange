import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { clientLogos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidateClientLogo } from "@/lib/revalidate";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const [row] = await db
    .update(clientLogos)
    .set(body)
    .where(eq(clientLogos.id, id))
    .returning();
  revalidateClientLogo();
  return NextResponse.json(row);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await db.delete(clientLogos).where(eq(clientLogos.id, id));
  revalidateClientLogo();
  return new NextResponse(null, { status: 204 });
}
