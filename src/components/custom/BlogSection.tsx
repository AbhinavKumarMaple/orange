"use client";

import Image from "next/image";
import { colors } from "@/lib/colors";
import { mediaUrl } from "@/lib/utils";
import SectionLayout from "./SectionLayout";
import Button from "./Button";
import { usePageTransition } from "./PageTransition";
import type { articles } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type Article = InferSelectModel<typeof articles>;

interface Props {
    articles: Article[];
}

export default function BlogSection({ articles }: Props) {
    const { navigate } = usePageTransition();

    const headerRight = (
        <div className="flex flex-col items-start gap-4 sm:self-end">
            <p
                className="font-sans font-normal"
                style={{ color: colors.dark, fontSize: "clamp(14px, 1.5vw, 20px)", lineHeight: "1.4", letterSpacing: "-0.6px", maxWidth: 332, opacity: 0.5 }}
            >
                Free advice on branding, design, marketing, and business growth from our team of experts.
            </p>
            <Button onClick={() => navigate("/blog")} variant="primary" data-track-click="blog_read_all" style={{ fontSize: 14, padding: "10px 20px" }}>
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
            data-section="Blog"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.slice(0, 2).map((post) => (
                    <div
                        key={post.slug}
                        className="group block bg-white cursor-pointer p-4"
                        style={{ borderRadius: 8 }}
                        onClick={() => navigate(`/articles/${post.slug}`)}
                        data-track-click={`blog_article_${post.slug}`}
                        data-track-hover={`blog_article_${post.slug}`}
                    >
                        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/10", borderRadius: 8 }}>
                            <Image
                                src={mediaUrl(post.image, "scale-down-to=1024&width=1200&height=673")}
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="pt-4 pb-2">
                            <h3
                                className="font-sans font-medium mb-2"
                                style={{ color: colors.dark, fontSize: 22, lineHeight: "28px", letterSpacing: "-0.44px", maxWidth: 320 }}
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
