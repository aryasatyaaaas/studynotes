"use client";

import type { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ToolbarProps {
    editor: Editor;
    onImageUpload: () => void;
}

export function EditorToolbar({ editor, onImageUpload }: ToolbarProps) {
    const addLink = () => {
        const url = window.prompt("Enter URL:");
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    return (
        <div className="flex items-center flex-wrap gap-0.5 p-2 border-b border-border/50 bg-muted/30">
            {/* Text Style */}
            <ToolBtn
                active={editor.isActive("bold")}
                onClick={() => editor.chain().focus().toggleBold().run()}
                title="Bold"
            >
                <b>B</b>
            </ToolBtn>
            <ToolBtn
                active={editor.isActive("italic")}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                title="Italic"
            >
                <i>I</i>
            </ToolBtn>
            <ToolBtn
                active={editor.isActive("underline")}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                title="Underline"
            >
                <u>U</u>
            </ToolBtn>
            <ToolBtn
                active={editor.isActive("strike")}
                onClick={() => editor.chain().focus().toggleStrike().run()}
                title="Strikethrough"
            >
                <s>S</s>
            </ToolBtn>
            <ToolBtn
                active={editor.isActive("highlight")}
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                title="Highlight"
            >
                <span className="text-amber">H</span>
            </ToolBtn>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Headings */}
            <ToolBtn
                active={editor.isActive("heading", { level: 1 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                title="Heading 1"
            >
                H1
            </ToolBtn>
            <ToolBtn
                active={editor.isActive("heading", { level: 2 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                title="Heading 2"
            >
                H2
            </ToolBtn>
            <ToolBtn
                active={editor.isActive("heading", { level: 3 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                title="Heading 3"
            >
                H3
            </ToolBtn>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Lists */}
            <ToolBtn
                active={editor.isActive("bulletList")}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                title="Bullet List"
            >
                •≡
            </ToolBtn>
            <ToolBtn
                active={editor.isActive("orderedList")}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                title="Numbered List"
            >
                1.
            </ToolBtn>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Block */}
            <ToolBtn
                active={editor.isActive("blockquote")}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                title="Blockquote"
            >
                ❝
            </ToolBtn>
            <ToolBtn
                active={editor.isActive("codeBlock")}
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                title="Code Block"
            >
                {"</>"}
            </ToolBtn>
            <ToolBtn
                active={false}
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                title="Horizontal Rule"
            >
                ─
            </ToolBtn>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Link & Image */}
            <ToolBtn
                active={editor.isActive("link")}
                onClick={addLink}
                title="Add Link"
            >
                🔗
            </ToolBtn>
            <ToolBtn active={false} onClick={onImageUpload} title="Upload Image">
                🖼
            </ToolBtn>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Undo/Redo */}
            <ToolBtn
                active={false}
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="Undo"
            >
                ↩
            </ToolBtn>
            <ToolBtn
                active={false}
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="Redo"
            >
                ↪
            </ToolBtn>
        </div>
    );
}

function ToolBtn({
    active,
    onClick,
    children,
    title,
    disabled,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
    title: string;
    disabled?: boolean;
}) {
    return (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={cn(
                "h-8 w-8 p-0 text-xs font-medium",
                active && "bg-amber/20 text-amber"
            )}
        >
            {children}
        </Button>
    );
}
