"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AnalyticsData } from "./types";

interface Props {
    textSelections: AnalyticsData["textSelections"];
}

export default function TextSelectionPanel({ textSelections }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm">Text Selections (What Users Copy)</CardTitle>
            </CardHeader>
            <CardContent>
                {textSelections.length === 0 ? (
                    <p className="text-sm text-gray-400">No text selection data yet</p>
                ) : (
                    <div className="space-y-3">
                        {textSelections.map((t, i) => (
                            <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                                <div className="flex items-start justify-between gap-4">
                                    <p className="text-sm text-gray-700 wrap-break-word">"{t.text}"</p>
                                    <span className="font-mono text-xs text-gray-500 shrink-0">{t.selection_count}x</span>
                                </div>
                                <div className="flex gap-2 mt-1">
                                    {t.section && <Badge variant="secondary" className="text-xs">{t.section}</Badge>}
                                    {t.element_tag && (
                                        <span className="text-xs text-gray-400">&lt;{t.element_tag}&gt;</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
