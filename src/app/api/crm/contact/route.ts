import { NextResponse } from "next/server";
import { getContactSubmissions } from "@/lib/queries";

/**
 * Admin-only endpoint that lists submitted contact requests for the CRM.
 *
 * Auth: enforced by the proxy middleware via the /api/crm(.*) route match.
 * Public form submissions go to /api/contact (no auth).
 */
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const submissions = await getContactSubmissions();
    return NextResponse.json(submissions);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
