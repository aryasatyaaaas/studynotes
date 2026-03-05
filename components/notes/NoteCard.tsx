"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface NoteCardProps {
    note: {
        id: string;
        title: string;
        summary: string | null;
        isPinned: boolean;
        tags: string[];
        updatedAt: string;
        subject: { name: string; color: string; emoji: string | null } | null;
    };
}

function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, "").trim();
}

export function NoteCard({ note }: NoteCardProps) {
    const preview = note.summary ? stripHtml(note.summary).slice(0, 120) : "No abstract provided.";

    return (
        <Link href={`/notes/${note.id}`}>
            <Card className="bg-card/50 border-border/50 hover:border-amber/30 hover:shadow-lg hover:shadow-amber/5 transition-all group cursor-pointer h-full">
                <CardContent className="p-4 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium text-sm line-clamp-1 group-hover:text-amber transition-colors">
                            {note.isPinned && <span className="mr-1">📌</span>}
                            {note.title || "Untitled"}
                        </h3>
                    </div>

                    {preview && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {preview}
                        </p>
                    )}

                    <div className="flex items-center gap-2 flex-wrap">
                        {note.subject && (
                            <Badge
                                variant="secondary"
                                className="text-xs"
                                style={{
                                    backgroundColor: `${note.subject.color}20`,
                                    color: note.subject.color,
                                }}
                            >
                                {note.subject.emoji && `${note.subject.emoji} `}
                                {note.subject.name}
                            </Badge>
                        )}
                        {note.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                        {note.tags.length > 2 && (
                            <span className="text-xs text-muted-foreground">
                                +{note.tags.length - 2}
                            </span>
                        )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                        {new Date(note.updatedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </p>
                </CardContent>
            </Card>
        </Link>
    );
}
