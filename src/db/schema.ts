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
  coverImage: text("cover_image").notNull().default(""),
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
  coverImage: text("cover_image").notNull().default(""),
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
  // Optional mobile-specific asset. Empty string falls back to `image`.
  mobileImage: text("mobile_image").notNull().default(""),
  heading: text("heading").notNull().default("Orange Studios"),
  subtext: text("subtext").notNull().default("Since 2023"),
  description: text("description").notNull().default("We are a creative studio building brands and websites that stand out, scale with growth and deliver measurable results."),
  ctaLabel: text("cta_label").notNull().default("Start your project"),
  ctaHref: text("cta_href").notNull().default("#Contact"),
  rating: text("rating").notNull().default("4.8/5"),
  roi: text("roi").notNull().default("3.2x Average ROI"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const showreelContent = pgTable("showreel_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: text("label").notNull().default("//02 Showreel"),
  heading: text("heading").notNull().default("See Our Work\nIn Motion"),
  description: text("description").notNull().default(
    "Experience a fast showcase of our best projects, highlighting bold design, seamless strategy, and measurable impact.",
  ),
  video: text("video").notNull().default(""),
  // CSS aspect-ratio value, e.g. "1841/1050", "16/9", "4/3", "1/1".
  // The video gets object-fit: cover so the source crops to fit this ratio.
  aspectRatio: text("aspect_ratio").notNull().default("1841/1050"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const brands = pgTable("brands", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  image: text("image").notNull(),
  width: integer("width").notNull().default(200),
  height: integer("height").notNull().default(60),
  order: integer("order").notNull().default(0),
});

// Single-row config for the //05 Why Choose Us section header + 4 stats.
// Stats live as fixed slots (not a sub-table) because the design is a 2x2
// grid; clearing both fields of a slot hides it. Heading uses the `|`
// line-break convention from lib/utils splitHeading/flattenHeading.
export const whyUsContent = pgTable("why_us_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: text("label").notNull().default("//05 Why choose us"),
  heading: text("heading").notNull().default("Details make|the difference"),
  description: text("description").notNull().default(
    "We're not just designers. We're your partners who help you grow and get real results you can see.",
  ),
  stat1Value: text("stat1_value").notNull().default("150+"),
  stat1Label: text("stat1_label").notNull().default("Completed projects"),
  stat2Value: text("stat2_value").notNull().default("3.2x"),
  stat2Label: text("stat2_label").notNull().default("Average ROI increase"),
  stat3Value: text("stat3_value").notNull().default("97%"),
  stat3Label: text("stat3_label").notNull().default("Client satisfaction rate"),
  stat4Value: text("stat4_value").notNull().default("24hr"),
  stat4Label: text("stat4_label").notNull().default("Average response time"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Logos rendered in the //05 Why Choose Us grid. Distinct table from `brands`
// because the visual context, sizing, and editorial intent differ — those are
// the scrolling marquee, these are the trust-building 4-up grid below stats.
export const clientLogos = pgTable("client_logos", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  image: text("image").notNull(),
  width: integer("width").notNull().default(200),
  height: integer("height").notNull().default(60),
  order: integer("order").notNull().default(0),
});

export const mediaAssets = pgTable("media_assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: text("url").notNull(),
  pathname: text("pathname").notNull(),
  size: integer("size").notNull().default(0),
  width: integer("width"),
  height: integer("height"),
  versions: jsonb("versions").notNull().default([]),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  // Poster image for video assets — captured first frame, served from
  // Vercel Blob. NULL for images (not needed) and for videos that haven't
  // been backfilled yet. Renderer falls back to no poster when NULL.
  thumbnailUrl: text("thumbnail_url"),
});

// CRM operators. Acts as the auth allowlist — only rows in this table can
// sign in. There's no self-signup endpoint anywhere in the app; users are
// added via the `scripts/create-crm-user.ts` CLI by an administrator.
// `passwordHash` is a bcrypt hash (never the plaintext password).
export const crmUsers = pgTable("crm_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  lastSignInAt: timestamp("last_sign_in_at"),
});

/**
 * Tracking links — marketing attribution / URL shortener.
 *
 * Each row is a short slug that, when visited via /t/<slug>, redirects
 * the user to `destinationUrl` after logging a row in
 * `tracking_link_clicks` with whatever metadata the request exposes.
 *
 * `source`/`medium`/`campaign` are user-set tags that we also append to
 * the destination URL as utm_* params (without overwriting any UTMs the
 * destination URL already has), so downstream analytics on the
 * destination (e.g. GA, PostHog there) also see the attribution.
 *
 * `clickCount` is denormalized for fast list rendering — we increment it
 * atomically alongside each click insert.
 */
export const trackingLinks = pgTable("tracking_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  destinationUrl: text("destination_url").notNull(),
  label: text("label"),
  source: text("source"),
  medium: text("medium"),
  campaign: text("campaign"),
  active: boolean("active").notNull().default(true),
  clickCount: integer("click_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: uuid("created_by").references(() => crmUsers.id, { onDelete: "set null" }),
  // Soft-delete timestamp. NULL = live, otherwise = "in trash since this
  // moment". `active = false` is a temporary off-switch (link can come
  // back); `deleted_at != NULL` means the editor moved it to trash. Both
  // make /t/<slug> return 410 Gone — but the data and click history are
  // preserved until a separate "delete permanently" action.
  deletedAt: timestamp("deleted_at"),
});

/**
 * Per-click event log. Every field is nullable because we only have what
 * the request happens to expose; some clients/proxies strip headers,
 * Vercel geo headers are only set in production, etc.
 *
 * The schema is deliberately wider than the UI displays — we store
 * everything that arrives so future analytics can be done without
 * back-population. The `rawHeaders` JSONB column is the catch-all for
 * any header we haven't promoted to a typed column yet.
 */
export const trackingLinkClicks = pgTable("tracking_link_clicks", {
  id: uuid("id").primaryKey().defaultRandom(),
  linkId: uuid("link_id").notNull().references(() => trackingLinks.id, { onDelete: "cascade" }),
  ts: timestamp("ts").defaultNow().notNull(),

  // Network
  ip: text("ip"),
  country: text("country"),
  region: text("region"),
  city: text("city"),
  timezone: text("timezone"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  postalCode: text("postal_code"),
  asn: text("asn"),
  host: text("host"),

  // Client (parsed from user agent)
  userAgent: text("user_agent"),
  browser: text("browser"),
  browserVersion: text("browser_version"),
  os: text("os"),
  osVersion: text("os_version"),
  deviceType: text("device_type"),   // mobile | tablet | desktop | bot | undefined
  deviceVendor: text("device_vendor"),
  deviceModel: text("device_model"),

  // Client Hints — modern replacement for UA parsing (Chrome / Edge).
  // Captured as-is from the `sec-ch-ua-*` headers when the browser sends them.
  chPlatform: text("ch_platform"),
  chPlatformVersion: text("ch_platform_version"),
  chMobile: boolean("ch_mobile"),
  chModel: text("ch_model"),

  // Page context
  referrer: text("referrer"),
  referrerHost: text("referrer_host"),

  // UTM (from the inbound URL on the short link, if any)
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  utmTerm: text("utm_term"),
  utmContent: text("utm_content"),

  // Ad-platform click IDs — preserved when the inbound URL has them,
  // so paid-ad attribution can be reconstructed later.
  gclid: text("gclid"),
  fbclid: text("fbclid"),
  msclkid: text("msclkid"),
  ttclid: text("ttclid"),

  // Full inbound query string — captures anything we don't model above
  // (e.g. custom tracking params, A/B variants, future ad-network IDs).
  queryString: text("query_string"),

  // Locale
  language: text("language"),
  acceptLanguage: text("accept_language"),

  // Privacy signals
  dnt: boolean("dnt"),
  gpc: boolean("gpc"),

  // Vercel request correlation
  vercelRequestId: text("vercel_request_id"),

  // Misc
  isBot: boolean("is_bot").notNull().default(false),

  // Everything else we received — kept verbatim (minus cookies / auth /
  // forwarded chain) for future analytics or debugging.
  rawHeaders: jsonb("raw_headers"),
});
