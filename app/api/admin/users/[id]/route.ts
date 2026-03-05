import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { checkAdminAccess } from "@/lib/admin/permissions"
import { headers } from "next/headers"

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const currentUser = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
    if (!currentUser) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const access = checkAdminAccess(currentUser.role, "SUPER_ADMIN")
    if (access) return access

    const { id } = await params
    if (id === session.user.id) {
        return Response.json({ error: "Cannot delete your own account" }, { status: 400 })
    }

    await prisma.user.delete({ where: { id } })
    return Response.json({ success: true })
}
