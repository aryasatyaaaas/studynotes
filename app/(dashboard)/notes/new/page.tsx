"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const TiptapEditor = dynamic(
    () => import("@/components/editor/TiptapEditor").then((mod) => mod.TiptapEditor),
    { ssr: false, loading: () => <Skeleton className="w-full h-[400px] rounded-xl" /> }
);

interface Subject {
    id: string;
    name: string;
    color: string;
    emoji: string | null;
}

export default function NewNotePage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [subjectId, setSubjectId] = useState<string | null>(null);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [noteId, setNoteId] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/subjects")
            .then((r) => r.json())
            .then((data) => setSubjects(Array.isArray(data) ? data : []))
            .catch(() => { });
    }, []);

    const handleSave = async () => {
        if (!title.trim()) return;
        setSaving(true);

        try {
            if (noteId) {
                // Update existing note
                await fetch(`/api/notes/${noteId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, content, subjectId, tags }),
                });
            } else {
                // Create new note
                const res = await fetch("/api/notes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, content, subjectId, tags }),
                });
                const data = await res.json();
                setNoteId(data.id);
            }
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            console.error("Save failed:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleAutoSave = (html: string) => {
        setContent(html);
        if (noteId && title.trim()) {
            fetch(`/api/notes/${noteId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: html }),
            }).then(() => {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            });
        }
    };

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                    ← Back
                </Button>
                <div className="flex items-center gap-2">
                    {saved && (
                        <span className="text-xs text-green-500 animate-in fade-in">
                            ✓ Saved
                        </span>
                    )}
                    <Button
                        onClick={handleSave}
                        disabled={saving || !title.trim()}
                        className="bg-amber text-amber-foreground hover:bg-amber/90"
                    >
                        {saving ? "Saving..." : noteId ? "Update" : "Create Note"}
                    </Button>
                </div>
            </div>

            {/* Title */}
            <Input
                placeholder="Note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-serif border-none bg-transparent px-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/50"
            />

            {/* Subject selector */}
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Subject:</span>
                <Button
                    variant={!subjectId ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSubjectId(null)}
                    className={!subjectId ? "bg-muted text-foreground" : ""}
                >
                    None
                </Button>
                {subjects.map((sub) => (
                    <Button
                        key={sub.id}
                        variant={subjectId === sub.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSubjectId(sub.id)}
                        style={
                            subjectId === sub.id
                                ? { backgroundColor: sub.color, color: "#fff" }
                                : {}
                        }
                    >
                        {sub.emoji && `${sub.emoji} `}
                        {sub.name}
                    </Button>
                ))}
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Tags:</span>
                {tags.map((tag) => (
                    <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer gap-1"
                        onClick={() => removeTag(tag)}
                    >
                        {tag} ✕
                    </Badge>
                ))}
                <Input
                    placeholder="Add tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    className="w-32 h-7 text-sm border-dashed"
                />
            </div>

            {/* Editor */}
            <TiptapEditor content={content} onUpdate={handleAutoSave} />
        </div>
    );
}
