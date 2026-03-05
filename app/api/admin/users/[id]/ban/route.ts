import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { checkAdminAccess } from "@/lib/admin/permissions"
import { headers } from "next/headers"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const access = checkAdminAccess(user.role, "ADMIN")
    if (access) return access

    const { id } = await params
    const { action } = await req.json()

    const target = await prisma.user.findUnique({ where: { id }, select: { role: true } })
    if (!target) return Response.json({ error: "User not found" }, { status: 404 })

    if (target.role !== "USER") {
        const superCheck = checkAdminAccess(user.role, "SUPER_ADMIN")
        if (superCheck) return Response.json({ error: "Cannot ban admin without SUPER_ADMIN" }, { status: 403 })
    }

    const updated = await prisma.user.update({
        where: { id },
        data: { isBanned: action === "ban" }
    })

    return Response.json({ success: true, isBanned: updated.isBanned })
}
