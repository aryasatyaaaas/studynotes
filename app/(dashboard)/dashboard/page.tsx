"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
    totalNotes: number;
    totalSubjects: number;
    pinnedNotes: number;
    recentNotes: Array<{
        id: string;
        title: string;
        updatedAt: string;
        isPinned: boolean;
        subject: { name: string; color: string; emoji: string | null } | null;
        tags: string[];
    }>;
}

export default function DashboardPage() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboard() {
            try {
                const [notesRes, subjectsRes] = await Promise.all([
                    fetch("/api/notes"),
                    fetch("/api/subjects"),
                ]);
                const notes = await notesRes.json();
                const subjects = await subjectsRes.json();
                const notesList = Array.isArray(notes) ? notes : notes.notes || [];
                const subjectsList = Array.isArray(subjects) ? subjects : [];

                setStats({
                    totalNotes: notesList.length,
                    totalSubjects: subjectsList.length,
                    pinnedNotes: notesList.filter((n: { isPinned: boolean }) => n.isPinned).length,
                    recentNotes: notesList.slice(0, 6),
                });
            } catch {
                setStats({ totalNotes: 0, totalSubjects: 0, pinnedNotes: 0, recentNotes: [] });
            } finally {
                setLoading(false);
            }
        }
        fetchDashboard();
    }, []);

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Welcome Header */}
            <div className="space-y-1">
                <h1 className="text-3xl md:text-4xl font-serif">
                    {greeting()},{" "}
                    <span className="text-amber">{session?.user?.name?.split(" ")[0] || "Student"}</span>
                </h1>
                <p className="text-muted-foreground">
                    Here&apos;s your study overview
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {loading ? (
                    <>
                        <Skeleton className="h-24 rounded-xl" />
                        <Skeleton className="h-24 rounded-xl" />
                        <Skeleton className="h-24 rounded-xl" />
                    </>
                ) : (
                    <>
                        <Card className="bg-card/50 border-border/50 hover:border-amber/30 transition-colors">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Total Notes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-serif text-amber">{stats?.totalNotes ?? 0}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/50 border-border/50 hover:border-amber/30 transition-colors">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Subjects
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-serif text-amber">{stats?.totalSubjects ?? 0}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/50 border-border/50 hover:border-amber/30 transition-colors">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Pinned
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-serif text-amber">{stats?.pinnedNotes ?? 0}</p>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3 flex-wrap">
                <Link href="/notes/new">
                    <Button className="bg-amber text-amber-foreground hover:bg-amber/90 gap-2">
                        <span>✏️</span> New Note
                    </Button>
                </Link>
                <Link href="/subjects">
                    <Button variant="secondary" className="gap-2">
                        <span>📚</span> Manage Subjects
                    </Button>
                </Link>
            </div>

            {/* Recent Notes */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-serif">Recent Notes</h2>
                    <Link href="/notes" className="text-sm text-amber hover:text-amber/80 transition-colors">
                        View all →
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-32 rounded-xl" />
                        ))}
                    </div>
                ) : stats?.recentNotes.length === 0 ? (
                    <Card className="bg-card/30 border-dashed border-border/50">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <p className="text-4xl mb-3">📝</p>
                            <p className="text-muted-foreground mb-4">No notes yet. Start writing!</p>
                            <Link href="/notes/new">
                                <Button className="bg-amber text-amber-foreground hover:bg-amber/90">
                                    Create your first note
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stats?.recentNotes.map((note) => (
                            <Link key={note.id} href={`/notes/${note.id}`}>
                                <Card className="bg-card/50 border-border/50 hover:border-amber/30 hover:shadow-lg hover:shadow-amber/5 transition-all group cursor-pointer h-full">
                                    <CardContent className="p-4 space-y-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="font-medium text-sm line-clamp-1 group-hover:text-amber transition-colors">
                                                {note.isPinned && "📌 "}
                                                {note.title || "Untitled"}
                                            </h3>
                                        </div>
                                        {note.subject && (
                                            <Badge
                                                variant="secondary"
                                                className="text-xs"
                                                style={{
                                                    backgroundColor: `${note.subject.color}20`,
                                                    color: note.subject.color,
                                                }}
                                            >
                                                {note.subject.emoji} {note.subject.name}
                                            </Badge>
                                        )}
                                        {note.tags.length > 0 && (
                                            <div className="flex gap-1 flex-wrap">
                                                {note.tags.slice(0, 3).map((tag) => (
                                                    <Badge key={tag} variant="outline" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(note.updatedAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
