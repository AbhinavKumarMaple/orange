import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import SignInForm from "./SignInForm";

export const metadata: Metadata = {
    title: "Sign in",
    description: "Sign in to the Orange Studios CRM.",
    robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Sign-in page. If the visitor already has a valid session, bounce them
 * straight to the CRM (or the redirect_url they were trying to reach
 * before being intercepted). Otherwise render the form.
 *
 * The destination is sanitized to a relative path to prevent open-redirect
 * (e.g. `?redirect_url=https://evil.example.com/`).
 */
export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ redirect_url?: string }>;
}) {
    const [user, params] = await Promise.all([getCurrentUser(), searchParams]);
    const target = sanitizeRedirect(params.redirect_url) ?? "/crm";

    if (user) redirect(target);

    return (
        <main className="flex min-h-screen items-center justify-center bg-[var(--brand-surface)] px-4 py-10">
            <SignInForm redirectTo={target} />
        </main>
    );
}

function sanitizeRedirect(value: string | undefined): string | null {
    if (!value) return null;
    if (value.startsWith("/") && !value.startsWith("//")) return value;
    return null;
}
