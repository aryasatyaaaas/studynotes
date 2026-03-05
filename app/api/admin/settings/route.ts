import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { checkAdminAccess } from "@/lib/admin/permissions"
import { headers } from "next/headers"

export async function GET() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const access = checkAdminAccess(user.role, "SUPER_ADMIN")
    if (access) return access

    const settings = await prisma.appSetting.findMany()
    const result: Record<string, string> = {}
    settings.forEach(s => { result[s.key] = s.value })

    return Response.json(result)
}

export async function POST(req: Request) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const access = checkAdminAccess(user.role, "SUPER_ADMIN")
    if (access) return access

    const { key, value } = await req.json()

    await prisma.appSetting.upsert({
        where: { key },
        update: { value, updatedBy: session.user.id },
        create: { key, value, updatedBy: session.user.id },
    })

    return Response.json({ success: true })
}
