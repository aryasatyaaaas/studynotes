"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SummarizeButton } from "@/components/ai/SummarizeButton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NoteData {
    id: string;
    title: string;
    content: string;
    summary: string | null;
    isPinned: boolean;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    subject: { id: string; name: string; color: string; emoji: string | null } | null;
    attachments: { id: string; filename: string; url: string; size: number; mimeType: string }[];
}

export default function NoteViewPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();
    const [note, setNote] = useState<NoteData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/notes/${id}`)
            .then((r) => {
                if (!r.ok) throw new Error("Not found");
                return r.json();
            })
            .then(setNote)
            .catch(() => router.push("/notes"))
            .finally(() => setLoading(false));
    }, [id, router]);

    const handlePin = async () => {
        if (!note) return;
        const res = await fetch(`/api/notes/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isPinned: !note.isPinned }),
        });
        if (res.ok) {
            setNote({ ...note, isPinned: !note.isPinned });
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this note?")) return;
        const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
        if (res.ok) router.push("/notes");
    };

    const handleExportPdf = async () => {
        if (!note) return;
        const html2pdf = (await import("html2pdf.js")).default;
        const element = document.getElementById("note-content");
        if (element) {
            html2pdf()
                .set({
                    margin: 1,
                    filename: `${note.title || "note"}.pdf`,
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: "cm", format: "a4", orientation: "portrait" },
                })
                .from(element)
                .save();
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-96 w-full rounded-xl" />
            </div>
        );
    }

    if (!note) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-2">
                <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                    ← Back
                </Button>
                <div className="flex items-center gap-2">
                    <SummarizeButton content={note.content} noteId={note.id} />
                    <Link href={`/notes/${id}/edit`}>
                        <Button variant="outline" size="sm" className="gap-2">
                            ✏️ Edit
                        </Button>
                    </Link>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">⋯</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handlePin}>
                                {note.isPinned ? "📌 Unpin" : "📌 Pin to top"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleExportPdf}>
                                📄 Export PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                                🗑️ Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-serif">
                    {note.isPinned && "📌 "}
                    {note.title}
                </h1>
                <div className="flex items-center gap-2 flex-wrap text-sm text-muted-foreground">
                    {note.subject && (
                        <Badge
                            variant="secondary"
                            style={{
                                backgroundColor: `${note.subject.color}20`,
                                color: note.subject.color,
                            }}
                        >
                            {note.subject.emoji && `${note.subject.emoji} `}
                            {note.subject.name}
                        </Badge>
                    )}
                    {note.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                        </Badge>
                    ))}
                    <span>
                        Updated{" "}
                        {new Date(note.updatedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div
                id="note-content"
                className="tiptap border border-border/50 rounded-xl bg-card/30 p-4 md:p-6 min-h-[300px]"
                dangerouslySetInnerHTML={{ __html: note.content }}
            />

            {/* Summary */}
            {note.summary && (
                <div className="border border-amber/30 rounded-xl bg-amber/5 p-4 md:p-6">
                    <h3 className="font-serif text-lg mb-3 text-amber">🤖 AI Summary</h3>
                    <div className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {note.summary}
                    </div>
                </div>
            )}
        </div>
    );
}
