import { getContactSubmissions } from "@/lib/queries";
import ContactSubmissionsClient from "./ContactSubmissionsClient";

export default async function ContactSubmissionsPage() {
    const submissions = await getContactSubmissions();
    return <ContactSubmissionsClient initialSubmissions={submissions} />;
}
