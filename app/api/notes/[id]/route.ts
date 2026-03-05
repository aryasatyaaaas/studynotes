import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

import DOMPurify from "isomorphic-dompurify";

const updateNoteSchema = z.object({
    title: z.string().min(1).max(200).trim().optional(),
    content: z.string().max(500_000).optional(),
    subjectId: z.string().cuid().optional().nullable(),
    tags: z.array(z.string().max(50).trim()).max(10).optional(),
    isPinned: z.boolean().optional(),
    summary: z.string().max(500_000).optional().nullable(),
});

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const note = await prisma.note.findFirst({
            where: { id, userId: session.user.id, deletedAt: null },
            include: { subject: true, attachments: true },
        });

        if (!note) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }

        return NextResponse.json(note);
    } catch (error) {
        console.error("GET /api/notes/[id] error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const parsed = updateNoteSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        if (parsed.data.content) {
            parsed.data.content = DOMPurify.sanitize(parsed.data.content, {
                ALLOWED_TAGS: ["p", "b", "i", "em", "strong", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "code", "pre", "blockquote", "img", "a"],
                FORBID_ATTR: ["onerror", "onclick", "onload"],
            });
        }

        // Verify ownership
        const existing = await prisma.note.findFirst({
            where: { id, userId: session.user.id, deletedAt: null },
        });

        if (!existing) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }

        const note = await prisma.note.update({
            where: { id },
            data: parsed.data,
            include: { subject: true, attachments: true },
        });

        return NextResponse.json(note);
    } catch (error) {
        console.error("PUT /api/notes/[id] error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const existing = await prisma.note.findFirst({
            where: { id, userId: session.user.id, deletedAt: null },
        });

        if (!existing) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }

        await prisma.note.update({
            where: { id },
            data: { deletedAt: new Date() }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/notes/[id] error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
