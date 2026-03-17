import Image from "next/image";
import Link from "next/link";
import { colors } from "@/lib/colors";
import SectionLayout from "./SectionLayout";

const posts = [
    {
        title: "Psychology of High-Converting Landing Pages",
        category: "Website design",
        date: "Jun 17, 2025",
        image: "https://framerusercontent.com/images/S2QOyOk4A16i6x2jsTudO4LAKA.png?scale-down-to=1024&width=1200&height=673",
        href: "#",
    },
    {
        title: "5 Signs Your Brand Identity Needs a Refresh",
        category: "Brand identity",
        date: "May 16, 2025",
        image: "https://framerusercontent.com/images/kf0L3mld1QAbDZWfDp3yi4LfwV8.png?scale-down-to=1024&width=2400&height=1800",
        href: "#",
    },
];

const headerRight = (
    <div className="flex flex-col items-start gap-4 self-end">
        <p
            className="font-sans font-normal"
            style={{ color: "rgb(6,18,24)", fontSize: 20, lineHeight: "26px", letterSpacing: "-0.6px", maxWidth: 332, opacity: 0.5 }}
        >
            Free advice on branding, design, marketing, and business growth from our team of experts.
        </p>
        <Link
            href="#"
            className="px-5 py-2.5 text-[14px] font-medium text-white rounded-lg"
            style={{ backgroundColor: colors.blue }}
        >
            Read all articles
        </Link>
    </div>
);

export default function BlogSection() {
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
                    <Link key={post.title} href={post.href} className="group block bg-white rounded-2xl p-4">
                        <div className="relative w-full overflow-hidden rounded-xl border border-white" style={{ height: 580 }}>
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
                                <span className="text-[14px] text-gray-500">{post.category}</span>
                                <span className="text-[14px] text-gray-400">{post.date}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </SectionLayout>
    );
}
