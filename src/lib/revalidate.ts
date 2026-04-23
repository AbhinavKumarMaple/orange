import { revalidatePath } from "next/cache";

/**
 * Centralized on-demand revalidation triggered from CRM mutations.
 *
 * Each content type declares exactly which public paths its changes affect.
 * This keeps invalidation surgical (not layout-wide) so the CRM itself stays
 * cached and unrelated routes don't regenerate on every edit.
 *
 * All helpers also revalidate /sitemap.xml and, where relevant, the RSS feed
 * so crawlers and subscribers see new content immediately.
 */

function revalidateSitemap() {
  revalidatePath("/sitemap.xml");
}

function revalidateRss() {
  revalidatePath("/articles/rss.xml");
}

export function revalidateArticle(slug?: string | null) {
  revalidatePath("/");
  revalidatePath("/blog");
  if (slug) revalidatePath(`/articles/${slug}`);
  revalidateSitemap();
  revalidateRss();
}

export function revalidateProject(slug?: string | null) {
  revalidatePath("/");
  revalidatePath("/projects");
  if (slug) revalidatePath(`/projects/${slug}`);
  revalidateSitemap();
}

export function revalidateHero() {
  revalidatePath("/");
}

export function revalidateFaq() {
  revalidatePath("/");
}

export function revalidateTestimonial() {
  revalidatePath("/");
}

export function revalidateService() {
  revalidatePath("/");
}

export function revalidatePricing() {
  revalidatePath("/");
}

export function revalidateSocialLinks() {
  revalidatePath("/", "layout");
}

export function revalidateMedia() {
  revalidatePath("/", "layout");
}

export function revalidateContactSubmission() {
  // No public-facing impact — submissions only affect the CRM.
}
