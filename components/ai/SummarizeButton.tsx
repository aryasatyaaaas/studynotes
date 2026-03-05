"use client";

import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompletion } from "@ai-sdk/react";
import { useEffect } from "react";

interface SummarizeButtonProps {
    content: string;
    noteId: string;
    onSummaryGenerated?: (summary: string) => void;
}

export function SummarizeButton({
    content,
    noteId,
    onSummaryGenerated,
}: SummarizeButtonProps) {
    const {
        aiPanelOpen,
        setAiPanelOpen,
        aiSummary,
        setAiSummary,
        aiLoading,
        setAiLoading,
    } = useAppStore();

    const { complete, completion, isLoading } = useCompletion({
        api: "/api/summarize",
        onFinish: async (prompt: string, result: string) => {
            // Save summary to note after streaming finishes
            await fetch(`/api/notes/${noteId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ summary: result }),
            });
            onSummaryGenerated?.(result);
            setAiLoading(false);
        },
        onError: () => {
            setAiSummary("❌ Failed to generate summary. Make sure Ollama is running with the llama3.2 model.");
            setAiLoading(false);
        }
    });

    useEffect(() => {
        if (completion) setAiSummary(completion);
    }, [completion, setAiSummary]);

    const handleSummarize = async () => {
        setAiPanelOpen(true);
        setAiLoading(true);
        setAiSummary("");
        complete(content.replace(/<[^>]*>/g, ""));
    };

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={handleSummarize}
                disabled={aiLoading}
                className="gap-2 border-amber/30 text-amber hover:bg-amber/10"
            >
                {aiLoading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Summarizing...
                    </span>
                ) : (
                    <>🤖 Rangkum dengan AI</>
                )}
            </Button>

            {/* AI Side Panel */}
            {aiPanelOpen && (
                <div className="fixed top-14 right-0 w-80 md:w-96 h-[calc(100vh-3.5rem)] bg-card border-l border-border/50 z-50 shadow-2xl flex flex-col">
                    <div className="flex items-center justify-between p-4 border-b border-border/50">
                        <h3 className="font-serif text-lg">🤖 AI Summary</h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setAiPanelOpen(false)}
                        >
                            ✕
                        </Button>
                    </div>
                    <ScrollArea className="flex-1 p-4">
                        {aiLoading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-4/5" />
                            </div>
                        ) : aiSummary ? (
                            <div className="prose prose-sm prose-invert max-w-none">
                                <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                                    {aiSummary}
                                </div>
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-sm">
                                Click &quot;Rangkum dengan AI&quot; to generate a summary.
                            </p>
                        )}
                    </ScrollArea>
                </div>
            )}
        </>
    );
}
