import { getArticles } from "@/lib/queries";
import { siteConfig, absoluteUrl } from "@/lib/site";

/**
 * RSS 2.0 feed for articles.
 *
 * Standards:
 *  - RSS 2.0 spec: https://www.rssboard.org/rss-specification
 *  - Atom self-link extension (required by most validators/readers).
 *  - content:encoded namespace for rich HTML bodies.
 *
 * Caching: prerendered at build, served from the Full Route Cache, and
 * invalidated on-demand whenever an article is created, updated, or deleted
 * (see lib/revalidate.ts). No time-based revalidation — CRM mutations are the
 * source of truth for freshness.
 */

export const dynamic = "force-static";
export const revalidate = false;

type ContentBlock = { heading?: string; body?: string };

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Wrap HTML content in CDATA safely (escape any stray ]]> sequences). */
function cdata(value: string): string {
  const safe = value.replace(/]]>/g, "]]]]><![CDATA[>");
  return `<![CDATA[${safe}]]>`;
}

/** RFC 822 date format required by RSS pubDate/lastBuildDate. */
function rfc822(date: Date): string {
  return date.toUTCString();
}

/** Render an article's JSONB content blocks to HTML for <content:encoded>. */
function renderArticleHtml(blocks: ContentBlock[], coverImage?: string): string {
  const parts: string[] = [];
  if (coverImage) {
    parts.push(`<p><img src="${xmlEscape(coverImage)}" alt="" /></p>`);
  }
  for (const block of blocks) {
    if (block.heading) parts.push(`<h2>${xmlEscape(block.heading)}</h2>`);
    if (block.body) {
      // Preserve paragraphs if authors used blank lines as separators.
      const paragraphs = block.body
        .split(/\n{2,}/)
        .map((p) => `<p>${xmlEscape(p.trim())}</p>`)
        .join("");
      parts.push(paragraphs);
    }
  }
  return parts.join("");
}

export async function GET() {
  const articles = await getArticles();
  const feedUrl = absoluteUrl(siteConfig.rssFeedUrl);
  const buildDate = rfc822(new Date());

  // Newest first in feeds
  const ordered = [...articles].sort((a, b) => {
    const at = a.createdAt?.getTime() ?? 0;
    const bt = b.createdAt?.getTime() ?? 0;
    return bt - at;
  });

  const items = ordered
    .map((article) => {
      const articleUrl = absoluteUrl(`/articles/${article.slug}`);
      const pubDate = rfc822(article.createdAt ?? new Date());
      const blocks = (article.content as ContentBlock[]) ?? [];
      const html = renderArticleHtml(blocks, article.coverImage || article.image);
      const imageUrl = article.coverImage || article.image;

      return `    <item>
      <title>${cdata(article.title)}</title>
      <link>${xmlEscape(articleUrl)}</link>
      <guid isPermaLink="true">${xmlEscape(articleUrl)}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${cdata(article.category)}</category>
      <description>${cdata(article.excerpt)}</description>
      <content:encoded>${cdata(html)}</content:encoded>${imageUrl
          ? `\n      <enclosure url="${xmlEscape(imageUrl)}" type="image/jpeg" length="0" />`
          : ""
        }
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${cdata(`${siteConfig.name} — Articles`)}</title>
    <link>${xmlEscape(siteConfig.url)}</link>
    <atom:link href="${xmlEscape(feedUrl)}" rel="self" type="application/rss+xml" />
    <description>${cdata(siteConfig.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <generator>Next.js RSS (orange)</generator>
    <ttl>60</ttl>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
