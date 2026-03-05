import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

const createSubjectSchema = z.object({
    name: z.string().min(1, "Name is required").max(100).trim(),
    color: z.string().max(20).default("#6366f1"),
    emoji: z.string().max(10).optional().nullable(),
});

export async function GET() {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const subjects = await prisma.subject.findMany({
            where: { userId: session.user.id },
            include: {
                _count: { select: { notes: true } },
            },
            orderBy: { name: "asc" },
        });

        return NextResponse.json(subjects);
    } catch (error) {
        console.error("GET /api/subjects error:", error);
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
        const parsed = createSubjectSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const subject = await prisma.subject.create({
            data: {
                ...parsed.data,
                userId: session.user.id,
            },
            include: {
                _count: { select: { notes: true } },
            },
        });

        return NextResponse.json(subject, { status: 201 });
    } catch (error) {
        console.error("POST /api/subjects error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
