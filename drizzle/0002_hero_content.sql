CREATE TABLE IF NOT EXISTS "hero_content" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "image" text NOT NULL DEFAULT '',
  "heading" text NOT NULL DEFAULT 'Orange Studios',
  "subtext" text NOT NULL DEFAULT 'Since 2019',
  "description" text NOT NULL DEFAULT 'We are a creative studio building brands and websites that stand out, scale with growth and deliver measurable results.',
  "cta_label" text NOT NULL DEFAULT 'Start your project',
  "cta_href" text NOT NULL DEFAULT '#',
  "rating" text NOT NULL DEFAULT '4.8/5',
  "roi" text NOT NULL DEFAULT '3.2x Average ROI',
  "updated_at" timestamp DEFAULT now()
);

-- Seed a single row so GET always returns something
INSERT INTO "hero_content" ("image", "heading", "subtext", "description", "cta_label", "cta_href", "rating", "roi")
VALUES (
  'https://tfo7hwi103lzosbj.public.blob.vercel-storage.com/hero.webp',
  'Orange Studios',
  'Since 2019',
  'We are a creative studio building brands and websites that stand out, scale with growth and deliver measurable results.',
  'Start your project',
  '#',
  '4.8/5',
  '3.2x Average ROI'
);
