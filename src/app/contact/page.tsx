import ContactPageClient from "./ContactPageClient";
import { getSocialLinks } from "@/lib/queries";

export const metadata = {
  title: "Contact Us | Orange Studios",
  description: "Get in touch with Orange Studios. We respond within 24 hours.",
};

export default async function ContactPage() {
  const socialLinks = await getSocialLinks();
  return <ContactPageClient socialLinks={socialLinks} />;
}
