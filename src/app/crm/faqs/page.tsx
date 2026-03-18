import { getFaqs } from "@/lib/queries";
import FaqsClient from "./FaqsClient";

export default async function FaqsPage() {
    const faqs = await getFaqs();
    return <FaqsClient initialData={faqs} />;
}
