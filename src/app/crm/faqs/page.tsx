import { getFaqs } from "@/lib/queries";
import FaqsClient from "./FaqsClient";

export const dynamic = "force-dynamic";

export default async function FaqsPage() {
    const faqs = await getFaqs();
    return <FaqsClient initialData={faqs} />;
}
