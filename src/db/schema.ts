import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  year: text("year").notNull(),
  industry: text("industry").notNull(),
  timeline: text("timeline").notNull(),
  description: text("description").notNull(),
  problem: text("problem").notNull(),
  solution: text("solution").notNull(),
  heroImage: text("hero_image").notNull(),
  images: text("images").array().notNull().default([]),
  icon: text("icon").notNull(),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const articles = pgTable("articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  date: text("date").notNull(),
  excerpt: text("excerpt").notNull(),
  image: text("image").notNull(),
  content: jsonb("content").notNull().default([]),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  icon: text("icon").notNull().default(""),
  images: text("images").array().notNull().default([""]),
  isFeatured: boolean("is_featured").notNull().default(false),
});

export const testimonials = pgTable("testimonials", {
  id: uuid("id").primaryKey().defaultRandom(),
  company: text("company").notNull(),
  quote: text("quote").notNull(),
  avatar: text("avatar").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  xPercent: text("x_percent").notNull().default("25%"),
  order: integer("order").notNull().default(0),
});

export const faqs = pgTable("faqs", {
  id: uuid("id").primaryKey().defaultRandom(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  order: integer("order").notNull().default(0),
});

export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  number: text("number").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull().default(""),
  order: integer("order").notNull().default(0),
});

export const pricingPlans = pgTable("pricing_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  subtitle: text("subtitle").notNull(),
  priceProject: integer("price_project").notNull(),
  priceMonthly: integer("price_monthly").notNull(),
  features: text("features").array().notNull().default([]),
  delivery: text("delivery").notNull(),
  isFeatured: boolean("is_featured").notNull().default(false),
  order: integer("order").notNull().default(0),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const socialLinks = pgTable("social_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  platform: text("platform").notNull(),
  url: text("url").notNull(),
  order: integer("order").notNull().default(0),
});

export const heroContent = pgTable("hero_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  image: text("image").notNull().default(""),
  heading: text("heading").notNull().default("Orange Studios"),
  subtext: text("subtext").notNull().default("Since 2019"),
  description: text("description").notNull().default("We are a creative studio building brands and websites that stand out, scale with growth and deliver measurable results."),
  ctaLabel: text("cta_label").notNull().default("Start your project"),
  ctaHref: text("cta_href").notNull().default("#"),
  rating: text("rating").notNull().default("4.8/5"),
  roi: text("roi").notNull().default("3.2x Average ROI"),
  updatedAt: timestamp("updated_at").defaultNow(),
});
