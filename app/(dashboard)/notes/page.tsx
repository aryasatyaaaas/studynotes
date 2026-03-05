"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { NoteList } from "@/components/notes/NoteList";
import { NoteSearch } from "@/components/notes/NoteSearch";
import { Button } from "@/components/ui/button";
import { useNotes } from "@/hooks/useNotes";
import { useDebounce } from "use-debounce";

function NotesPageContent() {
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [debouncedSearch] = useDebounce(search, 400);
    const [activeTag, setActiveTag] = useState<string | undefined>();
    const [pinnedOnly, setPinnedOnly] = useState(false);

    const { notes, loading } = useNotes({
        search: debouncedSearch,
        tag: activeTag,
        pinned: pinnedOnly
    });

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        notes.forEach((n) => n.tags.forEach((t) => tags.add(t)));
        return Array.from(tags).sort();
    }, [notes]);

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif">All Notes</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {notes.length} note{notes.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <Link href="/notes/new">
                    <Button className="bg-amber text-amber-foreground hover:bg-amber/90 gap-2">
                        <span>✏️</span> New Note
                    </Button>
                </Link>
            </div>

            <NoteSearch
                search={search}
                onSearchChange={setSearch}
                activeTag={activeTag}
                onTagClick={setActiveTag}
                tags={allTags}
                showPinnedFilter
                pinnedOnly={pinnedOnly}
                onPinnedToggle={() => setPinnedOnly(!pinnedOnly)}
            />

            <NoteList notes={notes} loading={loading} />
        </div>
    );
}

export default function NotesPage() {
    return (
        <Suspense fallback={<div>Loading notes...</div>}>
            <NotesPageContent />
        </Suspense>
    );
}
