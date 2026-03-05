"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Subject {
    id: string;
    name: string;
    color: string;
    emoji: string | null;
    _count?: { notes: number };
}

interface RecentNote {
    id: string;
    title: string;
    updatedAt: string;
    isPinned: boolean;
}

export function Sidebar() {
    const pathname = usePathname();
    const { sidebarOpen } = useAppStore();
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [recentNotes, setRecentNotes] = useState<RecentNote[]>([]);
    const [pinnedNotes, setPinnedNotes] = useState<RecentNote[]>([]);

    useEffect(() => {
        fetch("/api/subjects")
            .then((r) => r.json())
            .then(setSubjects)
            .catch(() => { });

        fetch("/api/notes?limit=5")
            .then((r) => r.json())
            .then((data) => {
                const notes = Array.isArray(data) ? data : data.notes || [];
                setRecentNotes(notes.slice(0, 5));
                setPinnedNotes(notes.filter((n: RecentNote) => n.isPinned).slice(0, 3));
            })
            .catch(() => { });
    }, [pathname]);

    if (!sidebarOpen) return null;

    return (
        <aside className="hidden md:flex w-64 flex-col border-r border-sidebar-border bg-sidebar h-screen sticky top-0 shrink-0">
            {/* Logo */}
            <div className="p-5 pb-3">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-amber flex items-center justify-center">
                        <span className="text-amber-foreground font-bold text-sm">S</span>
                    </div>
                    <h1 className="text-xl font-serif tracking-tight">
                        Study<span className="text-amber">Notes</span>
                    </h1>
                </Link>
            </div>

            <Separator className="bg-sidebar-border" />

            <ScrollArea className="flex-1 px-3 py-3">
                {/* New Note */}
                <Link href="/notes/new">
                    <Button
                        variant="default"
                        className="w-full mb-4 bg-amber text-amber-foreground hover:bg-amber/90 font-medium gap-2"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        New Note
                    </Button>
                </Link>

                {/* Navigation */}
                <nav className="space-y-1 mb-4">
                    <NavItem href="/dashboard" label="Dashboard" icon="📊" active={pathname === "/dashboard"} />
                    <NavItem href="/notes" label="All Notes" icon="📝" active={pathname === "/notes"} />
                    <NavItem href="/subjects" label="Subjects" icon="📚" active={pathname === "/subjects"} />
                </nav>

                <Separator className="bg-sidebar-border mb-3" />

                {/* Pinned Notes */}
                {pinnedNotes.length > 0 && (
                    <div className="mb-4">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
                            📌 Pinned
                        </p>
                        <div className="space-y-0.5">
                            {pinnedNotes.map((note) => (
                                <Link
                                    key={note.id}
                                    href={`/notes/${note.id}`}
                                    className={cn(
                                        "block text-sm px-2 py-1.5 rounded-md truncate transition-colors",
                                        pathname === `/notes/${note.id}`
                                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                            : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                                    )}
                                >
                                    {note.title || "Untitled"}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Subjects */}
                {subjects.length > 0 && (
                    <div className="mb-4">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
                            Subjects
                        </p>
                        <div className="space-y-0.5">
                            {subjects.map((subject) => (
                                <Link
                                    key={subject.id}
                                    href={`/subjects/${subject.id}`}
                                    className={cn(
                                        "flex items-center gap-2 text-sm px-2 py-1.5 rounded-md transition-colors",
                                        pathname === `/subjects/${subject.id}`
                                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                            : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                                    )}
                                >
                                    <span
                                        className="w-2 h-2 rounded-full shrink-0"
                                        style={{ backgroundColor: subject.color }}
                                    />
                                    <span className="truncate">
                                        {subject.emoji && `${subject.emoji} `}
                                        {subject.name}
                                    </span>
                                    {subject._count && (
                                        <span className="ml-auto text-xs text-muted-foreground">
                                            {subject._count.notes}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <Separator className="bg-sidebar-border mb-3" />

                {/* Recent Notes */}
                {recentNotes.length > 0 && (
                    <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
                            Recent
                        </p>
                        <div className="space-y-0.5">
                            {recentNotes.map((note) => (
                                <Link
                                    key={note.id}
                                    href={`/notes/${note.id}`}
                                    className={cn(
                                        "block text-sm px-2 py-1.5 rounded-md truncate transition-colors",
                                        pathname === `/notes/${note.id}`
                                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                            : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                                    )}
                                >
                                    {note.title || "Untitled"}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </ScrollArea>
        </aside>
    );
}

function NavItem({
    href,
    label,
    icon,
    active,
}: {
    href: string;
    label: string;
    icon: string;
    active: boolean;
}) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-2 px-2 py-2 rounded-md text-sm font-medium transition-colors",
                active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
        >
            <span>{icon}</span>
            {label}
        </Link>
    );
}
