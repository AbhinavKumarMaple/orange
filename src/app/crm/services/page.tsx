import { getServices } from "@/lib/queries";
import ServicesClient from "./ServicesClient";

export default async function ServicesPage() {
    const services = await getServices();
    return <ServicesClient initialData={services} />;
}
