import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import CrmSidebar from "./CrmSidebar";

export const metadata: Metadata = { title: "CRM — Orange Studios" };

export default function CrmLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <CrmSidebar />
            <main className="flex-1 p-8 overflow-auto">{children}</main>
            <Toaster richColors position="top-right" />
        </div>
    );
}
