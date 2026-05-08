# SEO Audit — theorangestudios.com

Audit performed 2026-05-07. Observations only; remediation is intentionally deferred so we can review/prioritize together before changing anything.

Legend: 🔴 critical · 🟠 important · 🟡 minor · ✅ correct (do not change)
Source: `[live]` = audited live site, `[code]` = audited repo, `[gsc]` = from Google Search Console screenshots.

---

## 1. Domain canonicalization & redirects

🔴 **C-1. Apex → www redirect is 307 (Temporary), not 308 (Permanent).** `[live]`
- `curl -I https://theorangestudios.com/` returns `HTTP/1.1 307 Temporary Redirect`
- Same for every apex path tested (`/`, `/projects`, `/projects/modern-legal-advisory`)
- Google docs explicitly require **301/308 (permanent)** redirects to consolidate canonical signals across hostnames. With 307, Google may keep both apex and www in its index and dilute signals.
- This is the root cause of the "Page with redirect (3 pages)" warning in GSC and of "URL is not on Google" when inspecting the apex variant.
- Fix lives at the host level (Vercel domain settings → set `theorangestudios.com` as a permanent redirect to `www.theorangestudios.com`) or via `next.config.ts → redirects()` with `permanent: true`.

✅ **www variant is canonical and indexed correctly.** `[live][gsc]`
- `<link rel="canonical">` on homepage and inner pages all point to the `www` host.
- GSC URL Inspection on `https://www.theorangestudios.com/` shows "URL is on Google" with HTTPS + FAQ enhancements detected.

✅ **HSTS is enabled** (`Strict-Transport-Security: max-age=63072000`). `[live]`

---

## 2. Favicon / icons

🔴 **F-1. New PNG icons are NOT on production.** `[live]`
- `https://www.theorangestudios.com/icon.png` → 404
- `https://www.theorangestudios.com/apple-icon.png` → 404
- `https://www.theorangestudios.com/icon.jpg` → 200 (still the old JPG)
- `https://www.theorangestudios.com/apple-icon.jpg` → 200 (still the old JPG)
- The PNG conversion ran locally and committed to working tree, but **not yet deployed**. Until a fresh deploy goes out, the favicon Google sees is still the JPG. The current `<link rel="icon">` in HTML is `icon.jpg?icon.8396a8bb.jpg`.
- Also: `/favicon.ico` returns 404. Many older crawlers and browser features look for it first; adding a small `public/favicon.ico` would be belt-and-suspenders.

🟠 **F-2. PWA manifest still references `/fav.jpg`.** `[code][live]`
- `src/lib/site.ts:69-70`: `logo: "/fav.jpg"`, `logoMimeType: "image/jpeg"`
- That value flows into:
  - `manifest.webmanifest` icons array (PWA install icon)
  - `Organization.logo` in JSON-LD on every page (Knowledge Graph signal)
- The new branded asset is `src/app/icon.png` (orange wordmark, 512×512). Manifest and JSON-LD should point at the same asset for consistency.

---

## 3. Sitemaps & indexing

🔴 **I-1. Sitemap has not been submitted in Search Console.** `[gsc]`
- GSC URL inspection panel shows: *Sitemaps: No referring sitemaps detected*.
- Sitemap exists at `/sitemap.xml` (200, 2.4 KB, 12 URLs) and is referenced by `robots.txt`. It just hasn't been registered via GSC → Sitemaps → Submit.
- Likely root cause of "Discovered – currently not indexed (9 pages)".

🟠 **I-2. 9 pages "Discovered – currently not indexed".** `[gsc]`
- These are URLs Google has seen (via crawl + sitemap reference in robots.txt) but hasn't crawled yet. Should resolve after sitemap submission + a few days of patience.
- Need the GSC list to know exactly which 9 — sitemap has 12 URLs (1 home, 3 list pages, 6 projects, 2 articles).

🟠 **I-3. 3 pages "Page with redirect".** `[gsc]`
- Almost certainly the apex variants of the indexed www pages. Will resolve once C-1 is fixed (308 permanent redirect lets Google drop the apex variants entirely).

✅ **robots.txt is correctly configured.** `[live]`
- Crawl allowed for `/`, properly disallows `/admin`, `/crm`, `/api/`. Includes `Host` and `Sitemap` directives.

✅ **Sitemap structure is valid.** `[live][code]`
- `src/app/sitemap.ts` generates static routes + dynamic project + article URLs from DB. Uses `siteConfig.url` which already points to www. All 12 entries return the canonical www host.
- Note: Google has formally said `<changefreq>` and `<priority>` are ignored. Not wrong, just noise.

---

## 4. Page-level metadata — homepage

🟠 **H-1. Two `<h1>` elements in the DOM.** `[live]`
- "OrangeStudios" inside `div.lg:hidden` (mobile-only)
- "Orange Studios" inside `div.hidden lg:block` (desktop-only)
- Only one is *visible* at any viewport, but both are present in DOM and crawlers see both.
- Google has said multiple H1s aren't a ranking penalty in 2026, but it's a code-smell that screen readers and SEO crawlers flag. Best to use a single H1 with responsive styling (or `aria-hidden="true"` on the off-viewport copy).

🟡 **H-2. `og:locale` is `null`.** `[live]`
- Set in `siteConfig.locale` per code, but the `<meta property="og:locale">` tag isn't being emitted. Probably because root layout's `metadata.openGraph` doesn't include `locale` directly (only via the inner config object).

🟡 **H-3. `twitter:site` (`@handle`) is `null`.** `[live]`
- Twitter cards render fine without it but having `@theorangestudios` (or whatever the handle is) wired up improves attribution.

✅ **Title, description, canonical, robots, manifest, OG image, Twitter card type all correct.** `[live]`
- Title: "Orange Studios — Creative studio for brands that want to stand out." (good length, brand + USP)
- Description: 184 chars — within Google's 155-160 char snippet window with overflow that Google can crop cleanly.
- `og:image` resolves to `/opengraph-image` (Next-generated 1200×630). `twitter:card = summary_large_image`.
- `lang="en"` on `<html>`.
- 3 valid JSON-LD blocks: `Organization`, `WebSite`, `FAQPage`.

---

## 5. Page-level metadata — project detail (`/projects/[slug]`)

🔴 **P-1. og:image / twitter:image can be an MP4 video.** `[live]`
- Audited `/projects/modern-legal-advisory`:
  - `og:image = https://tfo7hwi103lzosbj.public.blob.vercel-storage.com/WhatsApp%20Video%202026-05-03%20at%2015.14.31-hAfTXvOGrZUhu5V3GQMC5Sl7rDVTpd.mp4`
  - `twitter:image = ` same MP4 URL
- Open Graph and Twitter Card consumers (Facebook, LinkedIn, Slack, iMessage, X) **only render still images** as preview thumbnails — an MP4 URL produces no preview, just a broken card.
- Cause: `coverImage` field in CRM was filled with a video file. The metadata generator at `src/app/projects/[slug]/page.tsx` falls through to `coverImage || heroImage || /opengraph-image` without checking media type.
- Two ways to fix later:
  1. In `generateMetadata`, detect video URLs (use existing `isVideo()` from `lib/utils`) and skip them — fall back to `heroImage` or the route-level `/opengraph-image`.
  2. Add a separate `socialImage` field to the projects schema that the editor must populate with a still.

✅ **Per-project page SEO is otherwise solid.** `[live]`
- Single H1, all images have alt text, canonical correct, robots = `index, follow`, JSON-LD includes `CreativeWork` + `BreadcrumbList`, `og:type = article`.

---

## 6. Page-level metadata — article (`/articles/[slug]`)

✅ **Articles are exemplary.** `[live]`
- Title, description, canonical correct.
- `og:image` is PNG, `og:type = article`, `article:published_time` and `article:author` set.
- JSON-LD includes `BlogPosting` with `author`, `datePublished`, `image` — qualifies for Google's article rich result. Also `BreadcrumbList`.
- Single H1. All images have alt text.
- Use this article's metadata as the template if anything else gets refactored.

---

## 7. Page-level metadata — list pages (`/projects`, `/blog`, `/contact`)

✅ Audited `/projects`:
- Title: "Portfolio — Selected Work — Orange Studios" (note: brand name is doubled in the suffix template — "%s — Orange Studios" + the page already says "— Selected Work — Orange Studios". Cosmetic, not broken.)
- Description, canonical, single H1, no missing alt. Good.

🟡 **L-1. Title has a doubled brand name on `/projects`.** `[live]`
- Page-set title is `"Portfolio — Selected Work — Orange Studios"`, but the layout template adds `" — Orange Studios"` again? Worth a closer look — possibly the page is supplying the full title literally. Cosmetic, low-priority.

---

## 8. Lighthouse (mobile, navigation mode)

✅ **SEO: 100/100**
✅ **Best Practices: 100/100**
✅ **Agentic Browsing: 100/100**
🟠 **Accessibility: 96/100** — one failure: `color-contrast`.

🟠 **A-1. Multiple text elements fail WCAG AA contrast (4.5:1).** `[live]`
- Brand accent `#ff462e` on `#f9f9f9` background measures **3.23:1**. Used by:
  - `//` section labels (e.g. `//02 Showreel`)
  - Hero CTA accent text
- Muted text `#818181` on `#f9f9f9` measures **3.7:1**.
- Large gray decorative type `#e5e7eb` on white measures **1.23:1** (decorative, but still flagged).
- Page Experience is a Google ranking input — closing this nudges both UX and SEO.
- Fix path: darken `--brand-accent` slightly, or use it only on dark backgrounds. The dark `--brand-dark #090909` already passes when used on white.

---

## 9. Performance / Core Web Vitals

🔴 **PERF-AUDIT NEEDED.** Lighthouse run was navigation-mode + categories only (perf category not included in this run). Need a separate trace to score LCP / INP / CLS / TBT. Will run as a follow-up before the remediation phase.

---

## 10. Security headers

✅ Strict-Transport-Security, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy all present per `next.config.ts`. Vercel signs HTTPS. Nothing to address.

---

## 11. Consolidated priority list (preview only — actions deferred)

| ID | Severity | Area | Issue |
|---|---|---|---|
| C-1 | 🔴 | Domain | Apex 307 → www should be 308 permanent |
| F-1 | 🔴 | Icons | New `icon.png` / `apple-icon.png` not yet deployed |
| P-1 | 🔴 | OG images | Project pages can emit `og:image` pointing to MP4 |
| I-1 | 🔴 | GSC | Sitemap not submitted in Search Console |
| F-2 | 🟠 | Branding | Manifest + Organization JSON-LD logo still `/fav.jpg` |
| H-1 | 🟠 | Heading | Two H1s in homepage DOM (mobile + desktop dupes) |
| I-2 | 🟠 | Indexing | 9 pages "Discovered – currently not indexed" |
| I-3 | 🟠 | Indexing | 3 pages "Page with redirect" (related to C-1) |
| A-1 | 🟠 | A11y / PX | Color-contrast failures on accent/muted text |
| H-2 | 🟡 | Meta | `og:locale` not emitted |
| H-3 | 🟡 | Meta | `twitter:site` handle missing |
| L-1 | 🟡 | Title | `/projects` title has slight brand-name duplication |
| F-3 | 🟡 | Icons | `/favicon.ico` returns 404 (legacy clients) |

---

## 12. To capture from Search Console (still pending — user screenshots)

This document is intentionally incomplete on the GSC side until the user supplies screenshots. Surfaces still to walk:

- [ ] Overview (top cards, banners)
- [ ] Insights (Google's recommendations)
- [ ] Performance → Search results (queries / CTR / position table)
- [ ] Indexing → Pages (full breakdown of "Why pages aren't indexed" reasons)
- [ ] Indexing → Sitemaps (after submission)
- [ ] Indexing → Videos
- [ ] Experience → Core Web Vitals (mobile + desktop URL counts)
- [ ] Experience → HTTPS
- [ ] Enhancements → FAQ (and any other rich result categories)
- [ ] Security & Manual Actions
- [ ] Links (internal + external)
- [ ] Settings → Crawl stats
- [ ] Settings → Verification status

Findings from each surface will be appended to this file under a new section before remediation begins.
