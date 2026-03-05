import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

import DOMPurify from "isomorphic-dompurify";

const createNoteSchema = z.object({
    title: z.string().min(1, "Title is required").max(200).trim(),
    content: z.string().max(500_000).default(""),
    subjectId: z.string().cuid().optional().nullable(),
    tags: z.array(z.string().max(50).trim()).max(10).default([]),
});

export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const subject = searchParams.get("subject");
        const tag = searchParams.get("tag");
        const search = searchParams.get("search");
        const pinned = searchParams.get("pinned");
        const limit = searchParams.get("limit");

        const where: Record<string, unknown> = { userId: session.user.id, deletedAt: null };

        if (subject) where.subjectId = subject;
        if (pinned === "true") where.isPinned = true;
        if (tag) where.tags = { has: tag };
        if (search) {
            const rawResults = await prisma.$queryRaw<{ id: string }[]>`
                SELECT id
                FROM "Note"
                WHERE "userId" = ${session.user.id}
                  AND search_vector @@ plainto_tsquery('indonesian', ${search})
                ORDER BY ts_rank(search_vector, plainto_tsquery('indonesian', ${search})) DESC
                LIMIT 50
            `;
            const matchingIds = rawResults.map(r => r.id);
            where.id = { in: matchingIds };
        }

        const notes = await prisma.note.findMany({
            where,
            select: {
                id: true,
                title: true,
                isPinned: true,
                summary: true,
                tags: true,
                createdAt: true,
                updatedAt: true,
                subject: {
                    select: { id: true, name: true, color: true, emoji: true },
                },
                attachments: {
                    select: { id: true, url: true, mimeType: true, filename: true, size: true },
                },
            },
            orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
            ...(limit ? { take: parseInt(limit) } : {}),
        });

        return NextResponse.json(notes);
    } catch (error) {
        console.error("GET /api/notes error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const parsed = createNoteSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const note = await prisma.note.create({
            data: {
                ...parsed.data,
                userId: session.user.id,
            },
            include: {
                subject: true,
                attachments: true,
            },
        });

        return NextResponse.json(note, { status: 201 });
    } catch (error) {
        console.error("POST /api/notes error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
