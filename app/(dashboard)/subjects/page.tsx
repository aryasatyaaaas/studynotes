"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

interface Subject {
    id: string;
    name: string;
    color: string;
    emoji: string | null;
    _count?: { notes: number };
}

const PRESET_COLORS = [
    "#6366f1", "#f59e0b", "#10b981", "#f43f5e", "#8b5cf6",
    "#06b6d4", "#ec4899", "#84cc16", "#14b8a6", "#f97316",
];

const PRESET_EMOJIS = ["📐", "🧮", "📊", "🔬", "🧪", "📖", "💻", "🎨", "🌍", "📝", "🧠", "⚡"];

export default function SubjectsPage() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [color, setColor] = useState("#6366f1");
    const [emoji, setEmoji] = useState("📖");

    const fetchSubjects = async () => {
        try {
            const res = await fetch("/api/subjects");
            const data = await res.json();
            setSubjects(Array.isArray(data) ? data : []);
        } catch {
            setSubjects([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSubjects(); }, []);

    const handleSave = async () => {
        if (!name.trim()) return;

        try {
            if (editingId) {
                await fetch(`/api/subjects/${editingId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, color, emoji }),
                });
            } else {
                await fetch("/api/subjects", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, color, emoji }),
                });
            }
            setDialogOpen(false);
            resetForm();
            fetchSubjects();
        } catch (err) {
            console.error("Save subject failed:", err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this subject? Notes will be unlinked but not deleted.")) return;
        await fetch(`/api/subjects/${id}`, { method: "DELETE" });
        fetchSubjects();
    };

    const openEdit = (subject: Subject) => {
        setEditingId(subject.id);
        setName(subject.name);
        setColor(subject.color);
        setEmoji(subject.emoji || "📖");
        setDialogOpen(true);
    };

    const resetForm = () => {
        setEditingId(null);
        setName("");
        setColor("#6366f1");
        setEmoji("📖");
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif">Subjects</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Organize your notes by course
                    </p>
                </div>
                <Dialog
                    open={dialogOpen}
                    onOpenChange={(open) => {
                        setDialogOpen(open);
                        if (!open) resetForm();
                    }}
                >
                    <DialogTrigger asChild>
                        <Button className="bg-amber text-amber-foreground hover:bg-amber/90 gap-2">
                            <span>➕</span> New Subject
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="font-serif">
                                {editingId ? "Edit Subject" : "New Subject"}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-2">
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input
                                    placeholder="e.g. Data Structures"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Color</Label>
                                <div className="flex gap-2 flex-wrap">
                                    {PRESET_COLORS.map((c) => (
                                        <button
                                            key={c}
                                            className={`w-8 h-8 rounded-full border-2 transition-transform ${color === c ? "border-foreground scale-110" : "border-transparent"
                                                }`}
                                            style={{ backgroundColor: c }}
                                            onClick={() => setColor(c)}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Emoji</Label>
                                <div className="flex gap-2 flex-wrap">
                                    {PRESET_EMOJIS.map((e) => (
                                        <button
                                            key={e}
                                            className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center border transition-all ${emoji === e
                                                    ? "border-amber bg-amber/20 scale-110"
                                                    : "border-border hover:border-amber/30"
                                                }`}
                                            onClick={() => setEmoji(e)}
                                        >
                                            {e}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <Button onClick={handleSave} className="w-full bg-amber text-amber-foreground hover:bg-amber/90">
                                {editingId ? "Update" : "Create Subject"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-28 rounded-xl" />
                    ))}
                </div>
            ) : subjects.length === 0 ? (
                <Card className="bg-card/30 border-dashed border-border/50">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-4xl mb-3">📚</p>
                        <p className="text-muted-foreground mb-4">
                            No subjects yet. Create one to organize your notes!
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjects.map((subject) => (
                        <Card
                            key={subject.id}
                            className="bg-card/50 border-border/50 hover:border-amber/30 transition-all group"
                        >
                            <CardContent className="p-4 space-y-3">
                                <div className="flex items-start justify-between">
                                    <Link href={`/subjects/${subject.id}`} className="flex items-center gap-2 group-hover:text-amber transition-colors">
                                        <span
                                            className="w-3 h-3 rounded-full shrink-0"
                                            style={{ backgroundColor: subject.color }}
                                        />
                                        <span className="font-medium">
                                            {subject.emoji && `${subject.emoji} `}
                                            {subject.name}
                                        </span>
                                    </Link>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(subject)}>
                                            ✏️
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={() => handleDelete(subject.id)}>
                                            🗑
                                        </Button>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                    {subject._count?.notes ?? 0} notes
                                </Badge>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
