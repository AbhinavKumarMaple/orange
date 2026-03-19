import { NextResponse } from "next/server";
import { queryPostHog, toObjects } from "@/lib/posthogServer";

export const dynamic = "force-dynamic";

async function safeQuery<T = Record<string, unknown>>(
  query: string,
): Promise<T[]> {
  try {
    const result = await queryPostHog(query);
    return toObjects<T>(result);
  } catch (e) {
    console.error("Analytics query failed:", e);
    return [];
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get("days") || "30", 10);
  const dateFilter = `timestamp >= now() - interval ${days} day`;

  const [
    overview,
    pageViews,
    scrollDepth,
    sectionViews,
    sectionTime,
    ctaClicks,
    faqOpens,
    hoverData,
    textSelections,
    formFunnel,
    formResults,
    pricingToggle,
    deviceBreakdown,
    referrers,
    dailyVisitors,
    topArticles,
    topProjects,
  ] = await Promise.all([
    // 1. Overview stats
    safeQuery(`
      SELECT
        count(DISTINCT properties.$session_id) as total_sessions,
        count(*) as total_pageviews,
        count(DISTINCT person_id) as unique_visitors
      FROM events
      WHERE event = '$pageview' AND ${dateFilter}
    `),

    // 2. Page views breakdown
    safeQuery(`
      SELECT
        properties.path as page,
        count(*) as views,
        count(DISTINCT properties.$session_id) as unique_sessions
      FROM events
      WHERE event = '$pageview' AND ${dateFilter}
      GROUP BY properties.path
      ORDER BY views DESC
      LIMIT 20
    `),

    // 3. Scroll depth per page
    safeQuery(`
      SELECT
        properties.path as page,
        properties.depth_percent as depth,
        count(*) as count
      FROM events
      WHERE event = 'scroll_depth' AND ${dateFilter}
      GROUP BY properties.path, properties.depth_percent
      ORDER BY properties.path, depth
    `),

    // 4. Section visibility counts
    safeQuery(`
      SELECT
        properties.section as section,
        count(*) as view_count,
        count(DISTINCT properties.$session_id) as unique_sessions
      FROM events
      WHERE event = 'section_visible' AND ${dateFilter}
      GROUP BY properties.section
      ORDER BY view_count DESC
    `),

    // 5. Section time spent
    safeQuery(`
      SELECT
        properties.section as section,
        avg(properties.duration_seconds) as avg_duration,
        sum(properties.duration_seconds) as total_duration,
        count(*) as observations
      FROM events
      WHERE event = 'section_time' AND ${dateFilter}
      GROUP BY properties.section
      ORDER BY avg_duration DESC
    `),

    // 6. CTA clicks
    safeQuery(`
      SELECT
        properties.label as label,
        properties.section as section,
        properties.element_text as text,
        count(*) as clicks
      FROM events
      WHERE event = 'cta_click' AND ${dateFilter}
      GROUP BY properties.label, properties.section, properties.element_text
      ORDER BY clicks DESC
      LIMIT 30
    `),

    // 7. FAQ opens
    safeQuery(`
      SELECT
        properties.question as question,
        properties.faq_index as faq_index,
        count(*) as opens
      FROM events
      WHERE event = 'faq_opened' AND ${dateFilter}
      GROUP BY properties.question, properties.faq_index
      ORDER BY opens DESC
    `),

    // 8. Hover data
    safeQuery(`
      SELECT
        properties.label as label,
        properties.section as section,
        count(*) as hover_count,
        avg(properties.duration_ms) as avg_duration_ms
      FROM events
      WHERE event = 'element_hover' AND ${dateFilter}
      GROUP BY properties.label, properties.section
      ORDER BY hover_count DESC
      LIMIT 30
    `),

    // 9. Text selections
    safeQuery(`
      SELECT
        properties.text as text,
        properties.section as section,
        properties.element_tag as element_tag,
        count(*) as selection_count
      FROM events
      WHERE event = 'text_selected' AND ${dateFilter}
      GROUP BY properties.text, properties.section, properties.element_tag
      ORDER BY selection_count DESC
      LIMIT 20
    `),

    // 10. Contact form field focus funnel
    safeQuery(`
      SELECT
        properties.field as field,
        count(*) as focus_count,
        count(DISTINCT properties.$session_id) as unique_sessions
      FROM events
      WHERE event = 'form_field_focus' AND ${dateFilter}
      GROUP BY properties.field
      ORDER BY focus_count DESC
    `),

    // 11. Contact form results
    safeQuery(`
      SELECT
        event,
        count(*) as count
      FROM events
      WHERE event IN ('contact_form_submitted', 'contact_form_error') AND ${dateFilter}
      GROUP BY event
    `),

    // 12. Pricing toggle preference
    safeQuery(`
      SELECT
        properties.label as label,
        count(*) as clicks
      FROM events
      WHERE event = 'cta_click'
        AND properties.label IN ('pricing_toggle_project', 'pricing_toggle_monthly')
        AND ${dateFilter}
      GROUP BY properties.label
    `),

    // 13. Device breakdown
    safeQuery(`
      SELECT
        properties.$device_type as device_type,
        count(DISTINCT properties.$session_id) as sessions
      FROM events
      WHERE event = '$pageview' AND ${dateFilter}
      GROUP BY properties.$device_type
      ORDER BY sessions DESC
    `),

    // 14. Top referrers
    safeQuery(`
      SELECT
        properties.$referrer as referrer,
        count(DISTINCT properties.$session_id) as sessions
      FROM events
      WHERE event = '$pageview'
        AND properties.$referrer IS NOT NULL
        AND properties.$referrer != ''
        AND ${dateFilter}
      GROUP BY properties.$referrer
      ORDER BY sessions DESC
      LIMIT 10
    `),

    // 15. Daily visitors trend
    safeQuery(`
      SELECT
        toDate(timestamp) as date,
        count(DISTINCT properties.$session_id) as sessions,
        count(*) as pageviews
      FROM events
      WHERE event = '$pageview' AND ${dateFilter}
      GROUP BY toDate(timestamp)
      ORDER BY date
    `),

    // 16. Top articles
    safeQuery(`
      SELECT
        properties.path as page,
        count(*) as views
      FROM events
      WHERE event = '$pageview'
        AND properties.path LIKE '/articles/%'
        AND ${dateFilter}
      GROUP BY properties.path
      ORDER BY views DESC
      LIMIT 10
    `),

    // 17. Top projects
    safeQuery(`
      SELECT
        properties.path as page,
        count(*) as views
      FROM events
      WHERE event = '$pageview'
        AND properties.path LIKE '/projects/%'
        AND ${dateFilter}
      GROUP BY properties.path
      ORDER BY views DESC
      LIMIT 10
    `),
  ]);

  return NextResponse.json({
    overview: overview[0] || {
      total_sessions: 0,
      total_pageviews: 0,
      unique_visitors: 0,
    },
    pageViews,
    scrollDepth,
    sectionViews,
    sectionTime,
    ctaClicks,
    faqOpens,
    hoverData,
    textSelections,
    formFunnel,
    formResults,
    pricingToggle,
    deviceBreakdown,
    referrers,
    dailyVisitors,
    topArticles,
    topProjects,
    period: days,
  });
}
