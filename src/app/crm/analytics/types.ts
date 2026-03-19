export interface AnalyticsData {
  overview: {
    total_sessions: number;
    total_pageviews: number;
    unique_visitors: number;
  };
  pageViews: { page: string; views: number; unique_sessions: number }[];
  scrollDepth: { page: string; depth: number; count: number }[];
  sectionViews: {
    section: string;
    view_count: number;
    unique_sessions: number;
  }[];
  sectionTime: {
    section: string;
    avg_duration: number;
    total_duration: number;
    observations: number;
  }[];
  ctaClicks: { label: string; section: string; text: string; clicks: number }[];
  faqOpens: { question: string; faq_index: number; opens: number }[];
  hoverData: {
    label: string;
    section: string;
    hover_count: number;
    avg_duration_ms: number;
  }[];
  textSelections: {
    text: string;
    section: string;
    element_tag: string;
    selection_count: number;
  }[];
  formFunnel: { field: string; focus_count: number; unique_sessions: number }[];
  formResults: { event: string; count: number }[];
  pricingToggle: { label: string; clicks: number }[];
  deviceBreakdown: { device_type: string; sessions: number }[];
  referrers: { referrer: string; sessions: number }[];
  dailyVisitors: { date: string; sessions: number; pageviews: number }[];
  topArticles: { page: string; views: number }[];
  topProjects: { page: string; views: number }[];
  period: number;
}
