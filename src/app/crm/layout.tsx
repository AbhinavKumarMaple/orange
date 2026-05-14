import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import CrmSidebar from "./CrmSidebar";

export const metadata: Metadata = {
    title: "CRM — Orange Studios",
    robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

/**
 * CRM shell.
 *
 * - Outer container is exactly viewport-tall (`h-screen`) with overflow
 *   hidden, so the sidebar never scrolls away and pages own their own
 *   internal scrolling.
 * - `<main>` carries the scroll and the page padding, so most pages can
 *   just write tall content and have it scroll naturally.
 * - Pages that need to use the full main column edge-to-edge (e.g. the
 *   media library with its sticky toolbar + virtual list) opt out of the
 *   padding with `-m-8` and use `h-full` to size against main.
 */
export default function CrmLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <CrmSidebar />
            <main className="flex-1 p-8 overflow-auto">{children}</main>
            <Toaster richColors position="top-right" />
        </div>
    );
}
