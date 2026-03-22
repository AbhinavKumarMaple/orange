import { getPricingPlans } from "@/lib/queries";
import PricingClient from "./PricingClient";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
    const plans = await getPricingPlans();
    return <PricingClient initialData={plans} />;
}
