import type { BreakdownRow } from "../types";

export interface VisitorStats {
    window: { days: number; since: string };
    totals: {
        total: number;
        uniqueVisitors: number;
        newVisitors: number;
        returningVisitors: number;
        avgClicksPerVisitor: number;
        bots: number;
        firstClick: string | null;
        lastClick: string | null;
    };
    daily: Array<{ day: string; clicks: number; uniqueVisitors: number }>;
    topLinks: Array<{
        id: string;
        slug: string;
        label: string | null;
        source: string | null;
        medium: string | null;
        campaign: string | null;
        active: boolean;
        clicks: number;
        uniqueIps: number;
        lastClick: string | null;
    }>;
    breakdowns: {
        country: BreakdownRow[];
        deviceType: BreakdownRow[];
        browser: BreakdownRow[];
        os: BreakdownRow[];
        referrerHost: BreakdownRow[];
        source: BreakdownRow[];
        medium: BreakdownRow[];
        campaign: BreakdownRow[];
        language: BreakdownRow[];
    };
}

export interface VisitorRow {
    ip: string;
    visits: number;
    firstSeen: string;
    lastSeen: string;
    country: string | null;
    region: string | null;
    city: string | null;
    deviceType: string | null;
    browser: string | null;
    os: string | null;
    language: string | null;
    topReferrer: string | null;
    everBot: boolean;
}

export interface VisitorsResponse {
    items: VisitorRow[];
    total: number;
    nextOffset: number | null;
    window: { days: number; since: string };
}
