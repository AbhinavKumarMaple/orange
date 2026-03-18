"use client";

import Image from "next/image";
import { colors } from "@/lib/colors";
import SectionLayout from "./SectionLayout";
import Button from "./Button";
import { usePageTransition } from "./PageTransition";

const posts = [
    {
        slug: "psychology-of-high-converting-landing-pages",
        title: "Psychology of High-Converting Landing Pages",
        category: "Website design",
        date: "Jun 17, 2025",
        image: "https://framerusercontent.com/images/S2QOyOk4A16i6x2jsTudO4LAKA.png?scale-down-to=1024&width=1200&height=673",
    },
    {
        slug: "5-signs-your-brand-identity-needs-a-refresh",
        title: "5 Signs Your Brand Identity Needs a Refresh",
        category: "Brand identity",
        date: "May 16, 2025",
        image: "https://framerusercontent.com/images/kf0L3mld1QAbDZWfDp3yi4LfwV8.png?scale-down-to=1024&width=2400&height=1800",
    },
];

export default function BlogSection() {
    const { navigate } = usePageTransition();

    const headerRight = (
        <div className="flex flex-col items-start gap-4 self-end">
            <p
                className="font-sans font-normal"
                style={{ color: "rgb(6,18,24)", fontSize: 20, lineHeight: "26px", letterSpacing: "-0.6px", maxWidth: 332, opacity: 0.5 }}
            >
                Free advice on branding, design, marketing, and business growth from our team of experts.
            </p>
            <Button onClick={() => navigate("/blog")} variant="primary" style={{ fontSize: 14, padding: "10px 20px" }}>
                Read all articles
            </Button>
        </div>
    );

    return (
        <SectionLayout
            label="//08 Blog"
            heading={<>Latest<br />Insights</>}
            bg={colors.background}
            headerRight={headerRight}
            headerMb="mb-12"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                    <div
                        key={post.slug}
                        className="group block bg-white cursor-pointer p-4"
                        style={{ borderRadius: 8 }}
                        onClick={() => navigate(`/articles/${post.slug}`)}
                    >
                        <div className="relative w-full overflow-hidden" style={{ height: 580, borderRadius: 8 }}>
                            <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="pt-4 pb-2">
                            <h3
                                className="font-sans font-medium mb-2"
                                style={{ color: "rgb(6,18,24)", fontSize: 22, lineHeight: "28px", letterSpacing: "-0.44px", maxWidth: 320 }}
                            >
                                {post.title}
                            </h3>
                            <div className="flex items-center gap-6">
                                <span className="text-[14px]" style={{ color: colors.blue }}>{post.category}</span>
                                <span className="text-[14px] text-gray-400">{post.date}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </SectionLayout>
    );
}
