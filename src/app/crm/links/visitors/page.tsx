import type { Metadata } from "next";
import VisitorsClient from "./VisitorsClient";

export const metadata: Metadata = { title: "Visitor Insights — Orange Studios CRM" };

export default function Page() {
    return <VisitorsClient />;
}
