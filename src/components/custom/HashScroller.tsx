"use client";

import { useEffect } from "react";

/**
 * On mount, checks if the URL has a hash (e.g. /#Contact) and scrolls
 * to the matching data-section element. Used so nav overlay links like
 * Home/About/Contact work when navigating from other pages.
 */
export default function HashScroller() {
    useEffect(() => {
        const hash = window.location.hash.slice(1); // strip leading #
        if (!hash) return;

        // Give the page a moment to render before scrolling
        const timer = setTimeout(() => {
            const el = document.querySelector(`[data-section="${hash}"]`);
            if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 600);

        return () => clearTimeout(timer);
    }, []);

    return null;
}
