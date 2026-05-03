import { getClientLogos } from "@/lib/queries";
import ClientLogosClient from "./ClientLogosClient";

export const dynamic = "force-dynamic";

export default async function ClientLogosPage() {
    const logos = await getClientLogos();
    return <ClientLogosClient initialData={logos} />;
}
