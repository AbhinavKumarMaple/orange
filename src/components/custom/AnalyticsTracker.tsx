"use client";

import { useScrollDepth } from "@/hooks/useScrollDepth";
import { useSectionVisibility } from "@/hooks/useSectionVisibility";
import { useHoverTracking } from "@/hooks/useHoverTracking";
import { useTextSelection } from "@/hooks/useTextSelection";
import { useClickTracking } from "@/hooks/useClickTracking";

/**
 * Activates all custom analytics tracking hooks.
 * Place this inside any layout/page that needs full tracking.
 * Renders nothing — purely side-effect driven.
 */
export default function AnalyticsTracker() {
    useScrollDepth();
    useSectionVisibility();
    useHoverTracking();
    useTextSelection();
    useClickTracking();

    return null;
}
