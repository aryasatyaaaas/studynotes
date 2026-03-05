import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AdminTopbar } from "@/components/admin/AdminTopbar"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) redirect("/login")

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true, name: true, email: true },
    })

    if (!user || user.role === "USER") redirect("/dashboard")

    return (
        <div className="min-h-screen bg-background flex">
            <AdminSidebar userRole={user.role} />
            <div className="flex-1 flex flex-col min-w-0">
                <AdminTopbar userName={user.name ?? "Admin"} userEmail={user.email} />
                <main className="flex-1 p-6 lg:p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
