import type { Metadata } from "next";
import LinkDetailClient from "./LinkDetailClient";

export const metadata: Metadata = { title: "Link analytics — Orange Studios CRM" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <LinkDetailClient id={id} />;
}
