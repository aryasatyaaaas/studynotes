"use client";

import type { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BubbleMenuProps {
    editor: Editor;
}

export function EditorBubbleMenu({ editor }: BubbleMenuProps) {
    return (
        <div className="flex items-center gap-0.5 bg-card border border-border rounded-lg shadow-xl p-1">
            <BubbleBtn
                active={editor.isActive("bold")}
                onClick={() => editor.chain().focus().toggleBold().run()}
            >
                <b>B</b>
            </BubbleBtn>
            <BubbleBtn
                active={editor.isActive("italic")}
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                <i>I</i>
            </BubbleBtn>
            <BubbleBtn
                active={editor.isActive("underline")}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
                <u>U</u>
            </BubbleBtn>
            <BubbleBtn
                active={editor.isActive("strike")}
                onClick={() => editor.chain().focus().toggleStrike().run()}
            >
                <s>S</s>
            </BubbleBtn>
            <BubbleBtn
                active={editor.isActive("highlight")}
                onClick={() => editor.chain().focus().toggleHighlight().run()}
            >
                <span className="text-amber">H</span>
            </BubbleBtn>
            <BubbleBtn
                active={editor.isActive("link")}
                onClick={() => {
                    if (editor.isActive("link")) {
                        editor.chain().focus().unsetLink().run();
                    } else {
                        const url = window.prompt("Enter URL:");
                        if (url) editor.chain().focus().setLink({ href: url }).run();
                    }
                }}
            >
                🔗
            </BubbleBtn>
        </div>
    );
}

function BubbleBtn({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClick}
            className={cn(
                "h-7 w-7 p-0 text-xs",
                active && "bg-amber/20 text-amber"
            )}
        >
            {children}
        </Button>
    );
}
