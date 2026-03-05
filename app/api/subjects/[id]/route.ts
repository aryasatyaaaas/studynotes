import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

const updateSubjectSchema = z.object({
    name: z.string().min(1).max(100).trim().optional(),
    color: z.string().max(20).optional(),
    emoji: z.string().max(10).optional().nullable(),
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

        const subject = await prisma.subject.findFirst({
            where: { id, userId: session.user.id },
            select: {
                id: true,
                name: true,
                color: true,
                emoji: true,
                notes: {
                    orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
                    select: {
                        id: true,
                        title: true,
                        summary: true,
                        isPinned: true,
                        tags: true,
                        createdAt: true,
                        updatedAt: true,
                        subject: { select: { id: true, name: true, color: true, emoji: true } },
                        attachments: { select: { id: true, url: true, mimeType: true, filename: true, size: true } },
                    },
                },
                _count: { select: { notes: true } },
            },
        });

        if (!subject) {
            return NextResponse.json({ error: "Subject not found" }, { status: 404 });
        }

        return NextResponse.json(subject);
    } catch (error) {
        console.error("GET /api/subjects/[id] error:", error);
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
        const parsed = updateSubjectSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const existing = await prisma.subject.findFirst({
            where: { id, userId: session.user.id },
        });

        if (!existing) {
            return NextResponse.json({ error: "Subject not found" }, { status: 404 });
        }

        const subject = await prisma.subject.update({
            where: { id },
            data: parsed.data,
            include: { _count: { select: { notes: true } } },
        });

        return NextResponse.json(subject);
    } catch (error) {
        console.error("PUT /api/subjects/[id] error:", error);
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

        const existing = await prisma.subject.findFirst({
            where: { id, userId: session.user.id },
        });

        if (!existing) {
            return NextResponse.json({ error: "Subject not found" }, { status: 404 });
        }

        // Set notes' subjectId to null before deleting subject
        await prisma.$transaction([
            prisma.note.updateMany({ where: { subjectId: id }, data: { subjectId: null } }),
            prisma.subject.delete({ where: { id } }),
        ]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/subjects/[id] error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
