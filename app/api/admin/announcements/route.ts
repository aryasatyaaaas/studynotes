import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { checkAdminAccess } from "@/lib/admin/permissions"
import { headers } from "next/headers"

export async function GET() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const access = checkAdminAccess(user.role)
    if (access) return access

    const announcements = await prisma.announcement.findMany({
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true } } }
    })

    return Response.json(announcements)
}

export async function POST(req: Request) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const access = checkAdminAccess(user.role)
    if (access) return access

    const { title, message, type, expiresAt } = await req.json()

    const announcement = await prisma.announcement.create({
        data: {
            title,
            message,
            type: type || "INFO",
            createdBy: session.user.id,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
        }
    })

    return Response.json(announcement, { status: 201 })
}
