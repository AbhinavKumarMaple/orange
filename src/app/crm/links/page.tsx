import type { Metadata } from "next";
import LinksClient from "./LinksClient";

export const metadata: Metadata = { title: "Tracking Links — Orange Studios CRM" };

export default function Page() {
    return <LinksClient />;
}
