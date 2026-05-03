import { getBrands } from "@/lib/queries";
import BrandsClient from "./BrandsClient";

export const dynamic = "force-dynamic";

export default async function BrandsPage() {
    const brands = await getBrands();
    return <BrandsClient initialData={brands} />;
}
