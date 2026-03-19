"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AnalyticsData } from "./types";
import OverviewCards from "./OverviewCards";
import DailyTrend from "./DailyTrend";
import SectionEngagement from "./SectionEngagement";
import PageViewsTable from "./PageViewsTable";
import CtaClicksPanel from "./CtaClicksPanel";
import FaqInsights from "./FaqInsights";
import HoverInsights from "./HoverInsights";
import TextSelectionPanel from "./TextSelectionPanel";
import ContactFormFunnel from "./ContactFormFunnel";
import DeviceAndReferrers from "./DeviceAndReferrers";
import ContentPerformance from "./ContentPerformance";

const PERIODS = [
    { label: "7 days", value: 7 },
    { label: "30 days", value: 30 },
    { label: "90 days", value: 90 },
];

export default function AnalyticsClient() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [days, setDays] = useState(30);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/crm/analytics?days=${days}`);
                if (!res.ok) throw new Error(`Failed to fetch analytics: ${res.status}`);
                const json = await res.json();
                setData(json);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to load analytics");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [days]);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Analytics</h1>
                    <p className="text-sm text-gray-500">User behavior and engagement insights from PostHog.</p>
                </div>
                <div className="flex gap-1 bg-gray-100 rounded-md p-1">
                    {PERIODS.map((p) => (
                        <button
                            key={p.value}
                            onClick={() => setDays(p.value)}
                            className={`px-3 py-1.5 text-sm rounded transition-colors cursor-pointer ${days === p.value
                                    ? "bg-white text-gray-900 shadow-sm font-medium"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {loading && (
                <div className="flex items-center justify-center py-20">
                    <div className="text-sm text-gray-400">Loading analytics...</div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                    <p className="text-sm text-red-700">{error}</p>
                    <p className="text-xs text-red-500 mt-1">
                        Make sure POSTHOG_PERSONAL_API_KEY is set in .env.local
                    </p>
                </div>
            )}

            {data && !loading && (
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="sections">Sections</TabsTrigger>
                        <TabsTrigger value="interactions">Interactions</TabsTrigger>
                        <TabsTrigger value="content">Content</TabsTrigger>
                        <TabsTrigger value="audience">Audience</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <OverviewCards data={data} />
                        <DailyTrend dailyVisitors={data.dailyVisitors} />
                        <PageViewsTable pageViews={data.pageViews} scrollDepth={data.scrollDepth} />
                    </TabsContent>

                    <TabsContent value="sections" className="space-y-6">
                        <SectionEngagement
                            sectionViews={data.sectionViews}
                            sectionTime={data.sectionTime}
                        />
                    </TabsContent>

                    <TabsContent value="interactions" className="space-y-6">
                        <CtaClicksPanel ctaClicks={data.ctaClicks} pricingToggle={data.pricingToggle} />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <FaqInsights faqOpens={data.faqOpens} />
                            <ContactFormFunnel
                                formFunnel={data.formFunnel}
                                formResults={data.formResults}
                            />
                        </div>
                        <HoverInsights hoverData={data.hoverData} />
                        <TextSelectionPanel textSelections={data.textSelections} />
                    </TabsContent>

                    <TabsContent value="content" className="space-y-6">
                        <ContentPerformance
                            topArticles={data.topArticles}
                            topProjects={data.topProjects}
                        />
                    </TabsContent>

                    <TabsContent value="audience" className="space-y-6">
                        <DeviceAndReferrers
                            deviceBreakdown={data.deviceBreakdown}
                            referrers={data.referrers}
                        />
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
}
