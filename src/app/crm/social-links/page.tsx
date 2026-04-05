import { getSocialLinks } from "@/lib/queries";
import SocialLinksClient from "./SocialLinksClient";

export const dynamic = "force-dynamic";

export default async function SocialLinksPage() {
    const links = await getSocialLinks();
    return <SocialLinksClient initialData={links} />;
}
