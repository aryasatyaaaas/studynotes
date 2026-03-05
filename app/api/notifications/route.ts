import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function GET() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const announcements = await prisma.announcement.findMany({
        where: {
            isActive: true,
            OR: [
                { expiresAt: null },
                { expiresAt: { gt: new Date() } },
            ]
        },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            title: true,
            message: true,
            type: true,
            createdAt: true,
        }
    }).catch(() => [])

    return Response.json(announcements)
}
