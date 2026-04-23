import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { asc } from "drizzle-orm";
import { revalidateArticle } from "@/lib/revalidate";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.select().from(articles).orderBy(asc(articles.order));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const [row] = await db.insert(articles).values(body).returning();
  revalidateArticle(row?.slug);
  return NextResponse.json(row, { status: 201 });
}
