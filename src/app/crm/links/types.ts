export interface TrackingLink {
    id: string;
    slug: string;
    destinationUrl: string;
    label: string | null;
    source: string | null;
    medium: string | null;
    campaign: string | null;
    active: boolean;
    clickCount: number;
    createdAt: string | null;
    createdBy: string | null;
    /** ISO timestamp when the link was moved to trash. NULL = live. */
    deletedAt?: string | null;
}

export interface BreakdownRow {
    key: string;
    count: number;
}

export interface ClickRow {
    id: string;
    linkId: string;
    ts: string;
    ip: string | null;
    country: string | null;
    region: string | null;
    city: string | null;
    timezone: string | null;
    userAgent: string | null;
    browser: string | null;
    browserVersion: string | null;
    os: string | null;
    osVersion: string | null;
    deviceType: string | null;
    deviceVendor: string | null;
    deviceModel: string | null;
    referrer: string | null;
    referrerHost: string | null;
    utmSource: string | null;
    utmMedium: string | null;
    utmCampaign: string | null;
    utmTerm: string | null;
    utmContent: string | null;
    language: string | null;
    isBot: boolean;
}

export interface AnalyticsResponse {
    link: TrackingLink;
    window: { days: number; since: string };
    totals: {
        total: number;
        uniqueIps: number;
        bots: number;
        firstClick: string | null;
        lastClick: string | null;
    };
    daily: { day: string; count: number }[];
    breakdowns: {
        country: BreakdownRow[];
        deviceType: BreakdownRow[];
        browser: BreakdownRow[];
        os: BreakdownRow[];
        referrerHost: BreakdownRow[];
        source: BreakdownRow[];
    };
    recent: ClickRow[];
}
