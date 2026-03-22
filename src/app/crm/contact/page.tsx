import { getContactSubmissions } from "@/lib/queries";
import ContactSubmissionsClient from "./ContactSubmissionsClient";

export const dynamic = "force-dynamic";

export default async function ContactSubmissionsPage() {
    const submissions = await getContactSubmissions();
    return <ContactSubmissionsClient initialSubmissions={submissions} />;
}
