import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    try {
        const result = await prisma.note.deleteMany({
            where: {
                deletedAt: {
                    lte: thirtyDaysAgo,
                },
            },
        });

        return NextResponse.json({ success: true, deleted: result.count });
    } catch (error) {
        console.error("Cron execution failed:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
