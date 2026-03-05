"use client";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NoteSearchProps {
    search: string;
    onSearchChange: (search: string) => void;
    activeTag?: string;
    onTagClick?: (tag: string | undefined) => void;
    tags?: string[];
    showPinnedFilter?: boolean;
    pinnedOnly?: boolean;
    onPinnedToggle?: () => void;
}

export function NoteSearch({
    search,
    onSearchChange,
    activeTag,
    onTagClick,
    tags = [],
    showPinnedFilter,
    pinnedOnly,
    onPinnedToggle,
}: NoteSearchProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <Input
                        placeholder="Search notes..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9 bg-muted/50 border-transparent focus:border-amber/30"
                    />
                </div>
                {showPinnedFilter && (
                    <Button
                        variant={pinnedOnly ? "default" : "outline"}
                        size="sm"
                        onClick={onPinnedToggle}
                        className={cn(pinnedOnly && "bg-amber text-amber-foreground")}
                    >
                        📌 Pinned
                    </Button>
                )}
            </div>

            {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    <Badge
                        variant={!activeTag ? "default" : "outline"}
                        className={cn(
                            "cursor-pointer text-xs",
                            !activeTag && "bg-amber text-amber-foreground"
                        )}
                        onClick={() => onTagClick?.(undefined)}
                    >
                        All
                    </Badge>
                    {tags.map((tag) => (
                        <Badge
                            key={tag}
                            variant={activeTag === tag ? "default" : "outline"}
                            className={cn(
                                "cursor-pointer text-xs",
                                activeTag === tag && "bg-amber text-amber-foreground"
                            )}
                            onClick={() => onTagClick?.(tag)}
                        >
                            {tag}
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
}
