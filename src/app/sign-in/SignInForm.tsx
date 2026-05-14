"use client";

import { useState, type FormEvent } from "react";

/**
 * Sign-in form for the CRM.
 *
 * POSTs JSON to /api/auth/sign-in, expecting either:
 *   - 200 { ok: true, redirectTo: string } -> hard-navigate to redirectTo
 *   - 401/400 { error: string } -> show the message inline
 *
 * Uses `window.location.assign` instead of Next's router so we get a clean
 * full reload after the cookie is set — this guarantees Server Components
 * on the destination page (CRM dashboard, etc.) re-fetch with the new
 * session, with no stale-RSC weirdness.
 */
export default function SignInForm({ redirectTo }: { redirectTo: string }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/auth/sign-in", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, redirectTo }),
            });
            const data = await res.json().catch(() => null);
            if (!res.ok) {
                setError(data?.error ?? "Sign-in failed. Please try again.");
                setLoading(false);
                return;
            }
            const dest = typeof data?.redirectTo === "string" ? data.redirectTo : redirectTo;
            window.location.assign(dest);
        } catch {
            setError("Network error. Check your connection and try again.");
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm rounded-xl border border-black/10 bg-white p-8 shadow-sm"
            aria-label="Sign in to the Orange Studios CRM"
        >
            <h1 className="mb-1 text-2xl font-semibold tracking-tight text-[var(--brand-dark)]">
                Sign in
            </h1>
            <p className="mb-6 text-sm text-gray-500">
                Orange Studios admin only. Approved emails can sign in.
            </p>

            <label className="mb-1 block text-sm font-medium text-[var(--brand-dark)]" htmlFor="email">
                Email
            </label>
            <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="mb-4 w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--brand-accent)] disabled:opacity-50"
                placeholder="you@example.com"
            />

            <label className="mb-1 block text-sm font-medium text-[var(--brand-dark)]" htmlFor="password">
                Password
            </label>
            <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="mb-5 w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--brand-accent)] disabled:opacity-50"
            />

            {error && (
                <p
                    className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                    role="alert"
                >
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-[var(--brand-accent)] py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
                {loading ? "Signing in..." : "Sign in"}
            </button>
        </form>
    );
}
