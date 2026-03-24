"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Submission = {
    id: string;
    name: string;
    email: string;
    company: string | null;
    message: string;
    createdAt: Date | null;
};

export default function ContactSubmissionsClient({
    initialSubmissions,
}: {
    initialSubmissions: Submission[];
}) {
    const [submissions, setSubmissions] = useState(initialSubmissions);
    const [expanded, setExpanded] = useState<string | null>(null);

    async function handleDelete(id: string) {
        if (!confirm("Delete this submission?")) return;
        const res = await fetch(`/api/crm/contact/${id}`, { method: "DELETE" });
        if (res.ok) {
            setSubmissions((prev) => prev.filter((s) => s.id !== id));
            toast.success("Submission deleted");
        } else {
            toast.error("Failed to delete");
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Contact Requests</h1>
            <p className="text-sm text-gray-500 mb-6">{submissions.length} submission{submissions.length !== 1 ? "s" : ""}</p>

            {submissions.length === 0 ? (
                <p className="text-gray-400 text-sm">No submissions yet.</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {submissions.map((s) => (
                        <div key={s.id} className="bg-white border border-gray-200 rounded-lg p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <span className="font-semibold text-gray-900 text-sm">{s.name}</span>
                                        <Badge variant="secondary" className="text-xs">{s.email}</Badge>
                                        {s.company && (
                                            <Badge variant="outline" className="text-xs">{s.company}</Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 mb-2">
                                        {s.createdAt ? new Date(s.createdAt).toLocaleString() : "—"}
                                    </p>
                                    <p
                                        className={`text-sm text-gray-700 ${expanded === s.id ? "" : "line-clamp-2"}`}
                                    >
                                        {s.message}
                                    </p>
                                    {s.message.length > 120 && (
                                        <button
                                            className="text-xs text-blue-600 mt-1 hover:underline"
                                            onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                                        >
                                            {expanded === s.id ? "Show less" : "Show more"}
                                        </button>
                                    )}
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    {/* <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                    >
                                        <a href={`mailto:${s.email}`}>Reply</a>
                                    </Button> */}
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(s.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
