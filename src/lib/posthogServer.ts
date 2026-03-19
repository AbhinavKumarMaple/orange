/**
 * Server-side PostHog query helper.
 * Uses the PostHog HogQL API to run analytical queries.
 * Requires POSTHOG_PERSONAL_API_KEY in env.
 */

const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
const POSTHOG_PROJECT_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY!;
const POSTHOG_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY;

interface HogQLResult {
  columns: string[];
  results: unknown[][];
  types: string[];
}

/**
 * Execute a HogQL query against PostHog.
 * Falls back to project API key if personal key is not set.
 */
export async function queryPostHog(query: string): Promise<HogQLResult> {
  const apiKey = POSTHOG_API_KEY || POSTHOG_PROJECT_KEY;
  const isPersonalKey = !!POSTHOG_API_KEY;

  const res = await fetch(`${POSTHOG_HOST}/api/projects/@current/query/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(isPersonalKey
        ? { Authorization: `Bearer ${apiKey}` }
        : { Authorization: `Bearer ${apiKey}` }),
    },
    body: JSON.stringify({
      query: { kind: "HogQLQuery", query },
    }),
    next: { revalidate: 300 }, // cache for 5 minutes
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("PostHog query failed:", res.status, text);
    throw new Error(`PostHog query failed: ${res.status}`);
  }

  const data = await res.json();
  return data.results
    ? data
    : {
        columns: data.columns || [],
        results: data.results || [],
        types: data.types || [],
      };
}

/**
 * Helper to convert HogQL results into an array of objects.
 */
export function toObjects<T = Record<string, unknown>>(
  result: HogQLResult,
): T[] {
  return result.results.map((row) => {
    const obj: Record<string, unknown> = {};
    result.columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj as T;
  });
}
