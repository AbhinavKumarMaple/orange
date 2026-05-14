import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createContactSubmission } from "@/lib/queries";

/**
 * Public contact-form submission endpoint.
 *
 * Lives outside /api/crm/* on purpose: the proxy authentication middleware
 * blocks every route under /api/crm/, so the public marketing form must
 * POST to a path that doesn't require a session. The admin LIST endpoint
 * stays at /api/crm/contact (GET) where it's auth-protected.
 */
export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(254),
  company: z.string().max(200).optional(),
  message: z.string().min(1).max(5000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const submission = await createContactSubmission(data);
    return NextResponse.json(submission, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.flatten().fieldErrors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
