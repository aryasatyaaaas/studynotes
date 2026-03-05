"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { NoteList } from "@/components/notes/NoteList";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface SubjectData {
    id: string;
    name: string;
    color: string;
    emoji: string | null;
    notes: Array<{
        id: string;
        title: string;
        summary: string | null;
        isPinned: boolean;
        tags: string[];
        updatedAt: string;
        subject: { name: string; color: string; emoji: string | null } | null;
    }>;
    _count: { notes: number };
}

export default function SubjectDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();
    const [subject, setSubject] = useState<SubjectData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/subjects/${id}`)
            .then((r) => {
                if (!r.ok) throw new Error("Not found");
                return r.json();
            })
            .then(setSubject)
            .catch(() => router.push("/subjects"))
            .finally(() => setLoading(false));
    }, [id, router]);

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto space-y-4">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-36 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (!subject) return null;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" onClick={() => router.back()}>
                        ← Back
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: subject.color }}
                            />
                            <h1 className="text-3xl font-serif">
                                {subject.emoji && `${subject.emoji} `}
                                {subject.name}
                            </h1>
                        </div>
                        <Badge variant="secondary" className="mt-1 text-xs">
                            {subject._count.notes} notes
                        </Badge>
                    </div>
                </div>
                <Link href={`/notes/new`}>
                    <Button className="bg-amber text-amber-foreground hover:bg-amber/90 gap-2">
                        ✏️ New Note
                    </Button>
                </Link>
            </div>

            <NoteList notes={subject.notes} />
        </div>
    );
}
