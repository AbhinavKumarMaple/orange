import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import {
  mediaAssets, projects, articles, testimonials,
  services, heroContent,
} from "@/db/schema";
import { eq, sql } from "drizzle-orm";

/**
 * GET /api/crm/media/[id] — get asset details including versions
 */
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const [asset] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1);
  if (!asset) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(asset);
}

/**
 * PUT /api/crm/media/[id] — update metadata (width/height)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const [asset] = await db.update(mediaAssets)
    .set({ width: body.width, height: body.height })
    .where(eq(mediaAssets.id, id))
    .returning();
  return NextResponse.json(asset);
}

/**
 * POST /api/crm/media/[id] — upload a new version
 * Replaces the URL everywhere it's used across all content tables.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const [asset] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1);
  if (!asset) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  // Upload new version to blob
  const blob = await put(file.name, file, { access: "public", addRandomSuffix: true });
  const oldUrl = asset.url;
  const newUrl = blob.url;

  // Push old URL into versions array
  const oldVersions = (asset.versions as { url: string; size: number; replacedAt: string }[]) ?? [];
  const updatedVersions = [
    ...oldVersions,
    { url: oldUrl, size: asset.size, replacedAt: new Date().toISOString() },
  ];

  // Update the asset record
  const [updated] = await db.update(mediaAssets).set({
    url: newUrl,
    pathname: blob.pathname,
    size: file.size,
    versions: updatedVersions,
  }).where(eq(mediaAssets.id, id)).returning();

  // Replace old URL with new URL across all content tables
  const replaceUrl = (column: string, table: string) =>
    sql.raw(`UPDATE "${table}" SET "${column}" = REPLACE("${column}", '${oldUrl}', '${newUrl}') WHERE "${column}" LIKE '%${oldUrl}%'`);

  const replaceArrayUrl = (column: string, table: string) =>
    sql.raw(`UPDATE "${table}" SET "${column}" = array_replace("${column}", '${oldUrl}', '${newUrl}') WHERE '${oldUrl}' = ANY("${column}")`);

  await Promise.all([
    // projects
    db.execute(replaceUrl("hero_image", "projects")),
    db.execute(replaceUrl("cover_image", "projects")),
    db.execute(replaceUrl("icon", "projects")),
    db.execute(replaceArrayUrl("images", "projects")),
    // articles
    db.execute(replaceUrl("image", "articles")),
    db.execute(replaceUrl("cover_image", "articles")),
    db.execute(replaceUrl("icon", "articles")),
    db.execute(replaceArrayUrl("images", "articles")),
    // testimonials
    db.execute(replaceUrl("avatar", "testimonials")),
    // services
    db.execute(replaceUrl("image", "services")),
    // hero_content
    db.execute(replaceUrl("image", "hero_content")),
  ]);

  revalidatePath("/", "layout");

  return NextResponse.json({
    ...updated,
    uploadedAt: updated.uploadedAt?.toISOString(),
  });
}

/**
 * PATCH /api/crm/media/[id] — restore a specific old version by its URL
 * Body: { restoreUrl: string }
 * Swaps the current URL with the old version URL, updating all content tables.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { restoreUrl } = await req.json();
  if (!restoreUrl) return NextResponse.json({ error: "restoreUrl required" }, { status: 400 });

  const [asset] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1);
  if (!asset) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const oldVersions = (asset.versions as { url: string; size: number; replacedAt: string }[]) ?? [];
  const targetVersion = oldVersions.find((v) => v.url === restoreUrl);
  if (!targetVersion) return NextResponse.json({ error: "Version not found" }, { status: 404 });

  const currentUrl = asset.url;

  // Build new versions array: remove the restored version, add current as old version
  const newVersions = [
    ...oldVersions.filter((v) => v.url !== restoreUrl),
    { url: currentUrl, size: asset.size, replacedAt: new Date().toISOString() },
  ];

  // Update asset record
  const [updated] = await db.update(mediaAssets).set({
    url: restoreUrl,
    versions: newVersions,
  }).where(eq(mediaAssets.id, id)).returning();

  // Replace old URL with restored URL across all content tables
  const replaceUrl = (column: string, table: string) =>
    sql.raw(`UPDATE "${table}" SET "${column}" = REPLACE("${column}", '${currentUrl}', '${restoreUrl}') WHERE "${column}" LIKE '%${currentUrl}%'`);

  const replaceArrayUrl = (column: string, table: string) =>
    sql.raw(`UPDATE "${table}" SET "${column}" = array_replace("${column}", '${currentUrl}', '${restoreUrl}') WHERE '${currentUrl}' = ANY("${column}")`);

  await Promise.all([
    db.execute(replaceUrl("hero_image", "projects")),
    db.execute(replaceUrl("cover_image", "projects")),
    db.execute(replaceUrl("icon", "projects")),
    db.execute(replaceArrayUrl("images", "projects")),
    db.execute(replaceUrl("image", "articles")),
    db.execute(replaceUrl("cover_image", "articles")),
    db.execute(replaceUrl("icon", "articles")),
    db.execute(replaceArrayUrl("images", "articles")),
    db.execute(replaceUrl("avatar", "testimonials")),
    db.execute(replaceUrl("image", "services")),
    db.execute(replaceUrl("image", "hero_content")),
  ]);

  revalidatePath("/", "layout");

  return NextResponse.json({
    ...updated,
    uploadedAt: updated.uploadedAt?.toISOString(),
  });
}
