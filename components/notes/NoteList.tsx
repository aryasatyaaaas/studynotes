"use client";

import { NoteCard } from "./NoteCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Note {
    id: string;
    title: string;
    summary: string | null;
    isPinned: boolean;
    tags: string[];
    updatedAt: string;
    subject: { name: string; color: string; emoji: string | null } | null;
}

interface NoteListProps {
    notes: Note[];
    loading?: boolean;
}

export function NoteList({ notes, loading }: NoteListProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-36 rounded-xl" />
                ))}
            </div>
        );
    }

    if (notes.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-4xl mb-3">📝</p>
                <p className="text-muted-foreground">No notes found</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
                <NoteCard key={note.id} note={note} />
            ))}
        </div>
    );
}
