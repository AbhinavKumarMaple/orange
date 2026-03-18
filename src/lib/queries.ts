import { db } from "@/db";
import {
  projects,
  articles,
  testimonials,
  faqs,
  services,
  pricingPlans,
} from "@/db/schema";
import { eq, asc, ne } from "drizzle-orm";

export async function getProjects() {
  return db.select().from(projects).orderBy(asc(projects.order));
}

export async function getProject(slug: string) {
  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, slug))
    .limit(1);
  return rows[0] ?? null;
}

export async function getArticles() {
  return db.select().from(articles).orderBy(asc(articles.order));
}

export async function getArticle(slug: string) {
  const rows = await db
    .select()
    .from(articles)
    .where(eq(articles.slug, slug))
    .limit(1);
  return rows[0] ?? null;
}

export async function getRelatedArticles(currentSlug: string) {
  return db
    .select()
    .from(articles)
    .where(ne(articles.slug, currentSlug))
    .orderBy(asc(articles.order))
    .limit(2);
}

export async function getTestimonials() {
  return db.select().from(testimonials).orderBy(asc(testimonials.order));
}

export async function getFaqs() {
  return db.select().from(faqs).orderBy(asc(faqs.order));
}

export async function getServices() {
  return db.select().from(services).orderBy(asc(services.order));
}

export async function getPricingPlans() {
  return db.select().from(pricingPlans).orderBy(asc(pricingPlans.order));
}
