import "server-only";
import { UAParser } from "ua-parser-js";
import type { NextRequest } from "next/server";

/**
 * Tracking link helpers — slug generation, request-metadata extraction,
 * destination-URL assembly.
 *
 * Storage policy: we record EVERY piece of useful metadata the request
 * exposes, even if today's UI doesn't surface it. This lets future
 * analytics (e.g. ad-attribution, geo-fenced campaigns, fingerprint
 * matching) be done from existing data without back-population.
 *
 * Lives server-side: depends on Node crypto + reads request headers.
 */

const SLUG_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZabcdefghijkmnpqrstvwxyz"; // no O/0, I/l/1 lookalikes

/**
 * Generate a URL-safe slug. 7 chars from a 54-char alphabet ≈ 1.4e12
 * possible values — collision-free for our scale; unique constraint on
 * the column handles the rare collision.
 */
export function generateSlug(len = 7): string {
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  let out = "";
  for (let i = 0; i < len; i++) {
    out += SLUG_ALPHABET[bytes[i] % SLUG_ALPHABET.length];
  }
  return out;
}

/** Loose bot detection from a user agent string. Catches obvious crawlers. */
export function detectBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  return /bot|crawl|spider|crawler|slurp|search|bingpreview|googlebot|yandex|baidu|duckduck|facebookexternalhit|whatsapp|telegrambot|twitterbot|linkedinbot|slackbot|discordbot|skypeuripreview|applebot|preview|monitor|uptime/i.test(userAgent);
}

/**
 * Headers we deliberately DO NOT copy into `rawHeaders`. Cookies and
 * Authorization carry credentials; the various `x-forwarded-*` chain
 * headers leak internal proxy topology. Everything else is fair game.
 */
const SENSITIVE_HEADERS = new Set([
  "cookie",
  "authorization",
  "proxy-authorization",
  "x-forwarded-for",
  "x-forwarded-host",
  "x-forwarded-port",
  "x-forwarded-proto",
  "x-real-ip",
]);

/**
 * Shape of one row of `tracking_link_clicks`. Mirrors the DB schema 1:1
 * so we can spread the extractor's result straight into `db.insert(...)`.
 */
export interface ClickMetadata {
  // Network
  ip: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  timezone: string | null;
  latitude: string | null;
  longitude: string | null;
  postalCode: string | null;
  asn: string | null;
  host: string | null;

  // Client (UA parse)
  userAgent: string | null;
  browser: string | null;
  browserVersion: string | null;
  os: string | null;
  osVersion: string | null;
  deviceType: string | null;
  deviceVendor: string | null;
  deviceModel: string | null;

  // Client Hints
  chPlatform: string | null;
  chPlatformVersion: string | null;
  chMobile: boolean | null;
  chModel: string | null;

  // Page context
  referrer: string | null;
  referrerHost: string | null;

  // UTM
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;

  // Ad click IDs
  gclid: string | null;
  fbclid: string | null;
  msclkid: string | null;
  ttclid: string | null;

  // Raw query string
  queryString: string | null;

  // Locale
  language: string | null;
  acceptLanguage: string | null;

  // Privacy
  dnt: boolean | null;
  gpc: boolean | null;

  // Vercel
  vercelRequestId: string | null;

  // Misc
  isBot: boolean;

  // Catch-all
  rawHeaders: Record<string, string> | null;
}

export function extractClickMetadata(req: NextRequest): ClickMetadata {
  const h = req.headers;
  const get = (key: string) => h.get(key) ?? null;

  // --- Network / geo (Vercel headers + standard proxy headers) ---
  const fwd = h.get("x-forwarded-for");
  const ip = fwd ? fwd.split(",")[0].trim() : (h.get("x-real-ip") || null);

  // --- User Agent parse ---
  const userAgent = get("user-agent");
  let browser: string | null = null;
  let browserVersion: string | null = null;
  let os: string | null = null;
  let osVersion: string | null = null;
  let deviceType: string | null = null;
  let deviceVendor: string | null = null;
  let deviceModel: string | null = null;
  if (userAgent) {
    const ua = new UAParser(userAgent).getResult();
    browser = ua.browser.name ?? null;
    browserVersion = ua.browser.version ?? null;
    os = ua.os.name ?? null;
    osVersion = ua.os.version ?? null;
    deviceType = ua.device.type ?? (ua.os.name ? "desktop" : null);
    deviceVendor = ua.device.vendor ?? null;
    deviceModel = ua.device.model ?? null;
  }

  // --- Client Hints (strip surrounding quotes the browser sends) ---
  const chMobileRaw = get("sec-ch-ua-mobile");
  const chMobile = chMobileRaw == null ? null : chMobileRaw.replace(/^\?/, "") === "1";
  const chPlatform = unquote(get("sec-ch-ua-platform"));
  const chPlatformVersion = unquote(get("sec-ch-ua-platform-version"));
  const chModel = unquote(get("sec-ch-ua-model"));

  // --- Referrer ---
  const referrer = get("referer");
  let referrerHost: string | null = null;
  if (referrer) {
    try { referrerHost = new URL(referrer).host || null; } catch { referrerHost = null; }
  }

  // --- Locale ---
  const acceptLanguage = get("accept-language");
  const language = acceptLanguage ? acceptLanguage.split(",")[0].trim() : null;

  // --- Privacy signals ---
  const dnt = headerBool(get("dnt"));
  const gpc = headerBool(get("sec-gpc"));

  // --- URL params: UTM + ad click IDs + raw query ---
  const params = req.nextUrl.searchParams;
  const queryString = req.nextUrl.search ? req.nextUrl.search.slice(1) : null;

  // --- Raw headers JSONB (everything not sensitive) ---
  const raw: Record<string, string> = {};
  h.forEach((value, key) => {
    if (!SENSITIVE_HEADERS.has(key.toLowerCase())) raw[key] = value;
  });
  const rawHeaders = Object.keys(raw).length > 0 ? raw : null;

  return {
    // Network
    ip,
    country: get("x-vercel-ip-country"),
    region: get("x-vercel-ip-country-region"),
    city: get("x-vercel-ip-city"),
    timezone: get("x-vercel-ip-timezone"),
    latitude: get("x-vercel-ip-latitude"),
    longitude: get("x-vercel-ip-longitude"),
    postalCode: get("x-vercel-ip-postal-code"),
    asn: get("x-vercel-ip-as-number"),
    host: get("host"),

    // UA
    userAgent,
    browser,
    browserVersion,
    os,
    osVersion,
    deviceType,
    deviceVendor,
    deviceModel,

    // Client Hints
    chPlatform,
    chPlatformVersion,
    chMobile,
    chModel,

    // Referrer
    referrer,
    referrerHost,

    // UTM
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
    utmTerm: params.get("utm_term"),
    utmContent: params.get("utm_content"),

    // Ad click IDs
    gclid: params.get("gclid"),
    fbclid: params.get("fbclid"),
    msclkid: params.get("msclkid"),
    ttclid: params.get("ttclid"),

    // Raw query
    queryString,

    // Locale
    language,
    acceptLanguage,

    // Privacy
    dnt,
    gpc,

    // Vercel
    vercelRequestId: get("x-vercel-id"),

    // Misc
    isBot: detectBot(userAgent),

    // Catch-all
    rawHeaders,
  };
}

/**
 * Header values that boolean-ify nicely: "1" / "true" / "yes" / present
 * with no value all mean true; anything else (including absent) is null
 * so callers can distinguish "user opted in" from "header not sent".
 */
function headerBool(value: string | null): boolean | null {
  if (value == null) return null;
  const v = value.trim().toLowerCase();
  if (v === "1" || v === "true" || v === "yes") return true;
  if (v === "0" || v === "false" || v === "no" || v === "") return false;
  return null;
}

/** Client Hints values arrive wrapped in double quotes: `"macOS"` etc. */
function unquote(value: string | null): string | null {
  if (value == null) return null;
  return value.replace(/^"|"$/g, "").trim() || null;
}

/**
 * Build the final destination URL by appending the link's source/medium/
 * campaign as utm_* params — but only if the destination doesn't already
 * have them. Lets editors override per-destination if they want.
 *
 * Also forwards any utm_* params from the inbound short-link URL itself,
 * for advanced cases where someone wants to chain a tracker into another
 * tracker. (Common when posting the same link to many platforms with
 * minor per-post overrides.)
 */
export function buildDestinationUrl(
  destinationUrl: string,
  link: { source: string | null; medium: string | null; campaign: string | null },
  inboundUtm: { utmSource: string | null; utmMedium: string | null; utmCampaign: string | null; utmTerm: string | null; utmContent: string | null },
): string {
  let dest: URL;
  try {
    dest = new URL(destinationUrl);
  } catch {
    // Last-resort: if the destination is somehow malformed, just return it
    // as-is so the redirect doesn't 500 — let the browser tell the user.
    return destinationUrl;
  }

  const setIfMissing = (key: string, value: string | null) => {
    if (!value) return;
    if (dest.searchParams.has(key)) return;
    dest.searchParams.set(key, value);
  };

  // Prefer inbound URL UTMs over link tags so per-post overrides win.
  setIfMissing("utm_source", inboundUtm.utmSource ?? link.source);
  setIfMissing("utm_medium", inboundUtm.utmMedium ?? link.medium);
  setIfMissing("utm_campaign", inboundUtm.utmCampaign ?? link.campaign);
  setIfMissing("utm_term", inboundUtm.utmTerm);
  setIfMissing("utm_content", inboundUtm.utmContent);

  return dest.toString();
}
