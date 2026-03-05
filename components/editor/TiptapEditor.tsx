"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { useCallback, useEffect, useRef } from "react";
import imageCompression from "browser-image-compression";
import { EditorToolbar } from "./EditorToolbar";
import { EditorBubbleMenu } from "./EditorBubbleMenu";

interface TiptapEditorProps {
    content: string;
    onUpdate: (content: string) => void;
    editable?: boolean;
    placeholder?: string;
}

export function TiptapEditor({
    content,
    onUpdate,
    editable = true,
    placeholder = "Start writing your notes...",
}: TiptapEditorProps) {
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const compressImage = async (file: File) => {
        return await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true });
    };

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            Placeholder.configure({ placeholder }),
            Image.configure({ inline: false, allowBase64: false }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: "text-amber underline cursor-pointer" },
            }),
            Underline,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Highlight.configure({ multicolor: false }),
        ],
        content,
        editable,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                onUpdate(html);
            }, 2000);
        },
        editorProps: {
            attributes: {
                class: "tiptap prose prose-invert max-w-none focus:outline-none min-h-[400px] px-1",
            },
            transformPastedHTML(html) {
                return html.replace(/<img[^>]*src=["'](?:attachment|webkit-fake-url):[^>]*>/gi, "");
            },
            handlePaste: (view, event) => {
                const items = event.clipboardData?.items;
                if (!items) return false;

                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    if (item.type.indexOf("image") === 0) {
                        const file = item.getAsFile();
                        if (!file) continue;

                        compressImage(file).then(compressedFile => {
                            const formData = new FormData();
                            formData.append("file", compressedFile);
                            return fetch("/api/upload", { method: "POST", body: formData });
                        })
                            .then(r => r.json())
                            .then(data => {
                                if (data.url) {
                                    const { schema } = view.state;
                                    const node = schema.nodes.image.create({ src: data.url });
                                    const tr = view.state.tr.replaceSelectionWith(node);
                                    view.dispatch(tr);
                                }
                            }).catch(console.error);
                    }
                }
                return false;
            },
            handleDrop: (view, event, slice, moved) => {
                if (moved || !event.dataTransfer) return false;
                let handled = false;
                const files = event.dataTransfer.files;
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    if (file.type.indexOf("image") === 0) {
                        handled = true;
                        compressImage(file).then(compressedFile => {
                            const formData = new FormData();
                            formData.append("file", compressedFile);
                            return fetch("/api/upload", { method: "POST", body: formData });
                        })
                            .then(r => r.json())
                            .then(data => {
                                if (data.url) {
                                    const { schema } = view.state;
                                    const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                                    if (coordinates) {
                                        const node = schema.nodes.image.create({ src: data.url });
                                        const tr = view.state.tr.insert(coordinates.pos, node);
                                        view.dispatch(tr);
                                    }
                                }
                            }).catch(console.error);
                    }
                }
                return handled;
            }
        },
        immediatelyRender: false,
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content, { emitUpdate: false });
        }
    }, []);

    const handleImageUpload = useCallback(async () => {
        if (!editor) return;

        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            try {
                const compressedFile = await compressImage(file);
                const formData = new FormData();
                formData.append("file", compressedFile);

                const res = await fetch("/api/upload", { method: "POST", body: formData });
                if (res.ok) {
                    const data = await res.json();
                    editor.chain().focus().setImage({ src: data.url }).run();
                }
            } catch (err) {
                console.error("Upload failed:", err);
            }
        };
        input.click();
    }, [editor]);

    if (!editor) return null;

    return (
        <div className="border border-border/50 rounded-xl bg-card/30 overflow-hidden">
            <EditorToolbar editor={editor} onImageUpload={handleImageUpload} />
            {editor && (
                <BubbleMenu editor={editor}>
                    <EditorBubbleMenu editor={editor} />
                </BubbleMenu>
            )}
            <div className="p-4 md:p-6">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
