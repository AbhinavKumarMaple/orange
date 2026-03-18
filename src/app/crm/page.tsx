import { getProjects, getArticles, getServices, getFaqs, getTestimonials, getPricingPlans } from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function CrmDashboard() {
    const [projects, articles, services, faqs, testimonials, pricing] = await Promise.all([
        getProjects(), getArticles(), getServices(), getFaqs(), getTestimonials(), getPricingPlans(),
    ]);

    const stats = [
        { label: "Projects", count: projects.length, href: "/crm/projects" },
        { label: "Articles", count: articles.length, href: "/crm/articles" },
        { label: "Services", count: services.length, href: "/crm/services" },
        { label: "Pricing Plans", count: pricing.length, href: "/crm/pricing" },
        { label: "Testimonials", count: testimonials.length, href: "/crm/testimonials" },
        { label: "FAQs", count: faqs.length, href: "/crm/faqs" },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
            <p className="text-sm text-gray-500 mb-8">Manage all Orange Studios website content from here.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {stats.map((s) => (
                    <Link key={s.label} href={s.href}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">{s.label}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-gray-900">{s.count}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
