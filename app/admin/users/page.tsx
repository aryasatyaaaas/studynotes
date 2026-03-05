import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { RoleBadge } from "@/components/admin/RoleBadge"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { UserActions } from "./UserActions"
import { Search, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
    const { q, page = "1" } = await searchParams
    const pageSize = 20
    const skip = (Number(page) - 1) * pageSize

    const session = await auth.api.getSession({ headers: await headers() })
    const currentUser = await prisma.user.findUnique({
        where: { id: session!.user.id },
        select: { role: true },
    })

    const where = q ? {
        OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
        ]
    } : {}

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take: pageSize,
            select: {
                id: true, name: true, email: true, role: true,
                isBanned: true, createdAt: true,
                _count: { select: { notes: true, subjects: true } }
            }
        }),
        prisma.user.count({ where })
    ])

    const pageNum = Number(page)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-3xl font-semibold flex items-center gap-3">
                        <Users className="h-7 w-7 text-amber" /> Pengguna
                    </h1>
                    <p className="text-muted-foreground mt-1">{total} pengguna terdaftar</p>
                </div>
            </div>

            {/* Search */}
            <form className="flex gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input name="q" placeholder="Cari nama atau email..." defaultValue={q} className="pl-9 border-border bg-card" />
                </div>
                <Button type="submit" className="bg-amber text-amber-foreground">Cari</Button>
            </form>

            {/* Table */}
            <Card className="border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border text-muted-foreground">
                                <th className="text-left py-3 px-5 font-medium">Pengguna</th>
                                <th className="text-left py-3 px-3 font-medium">Role</th>
                                <th className="text-left py-3 px-3 font-medium">Status</th>
                                <th className="text-left py-3 px-3 font-medium">Catatan</th>
                                <th className="text-left py-3 px-3 font-medium">Bergabung</th>
                                <th className="text-right py-3 px-5 font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-muted/30">
                                    <td className="py-3 px-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                                                {user.name?.[0]?.toUpperCase() ?? "?"}
                                            </div>
                                            <div>
                                                <p className="font-medium">{user.name ?? "—"}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3"><RoleBadge role={user.role as "USER" | "ADMIN" | "SUPER_ADMIN"} /></td>
                                    <td className="py-3 px-3"><StatusBadge isBanned={user.isBanned} /></td>
                                    <td className="py-3 px-3 text-muted-foreground">{user._count.notes}</td>
                                    <td className="py-3 px-3 text-muted-foreground text-xs">
                                        {new Date(user.createdAt).toLocaleDateString("id-ID")}
                                    </td>
                                    <td className="py-3 px-5 text-right">
                                        <UserActions
                                            user={{
                                                id: user.id,
                                                name: user.name ?? "User",
                                                role: user.role as "USER" | "ADMIN" | "SUPER_ADMIN",
                                                isBanned: user.isBanned,
                                            }}
                                            currentUserRole={currentUser?.role as "ADMIN" | "SUPER_ADMIN"}
                                        />
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                                        {q ? "Tidak menemukan pengguna." : "Belum ada pengguna."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Pagination */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Menampilkan {users.length} dari {total}</span>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={pageNum <= 1} asChild={pageNum > 1}>
                        {pageNum > 1 ? <Link href={`/admin/users?page=${pageNum - 1}${q ? `&q=${q}` : ""}`}>← Sebelumnya</Link> : <span>← Sebelumnya</span>}
                    </Button>
                    <Button variant="outline" size="sm" disabled={pageNum * pageSize >= total} asChild={pageNum * pageSize < total}>
                        {pageNum * pageSize < total ? <Link href={`/admin/users?page=${pageNum + 1}${q ? `&q=${q}` : ""}`}>Berikutnya →</Link> : <span>Berikutnya →</span>}
                    </Button>
                </div>
            </div>
        </div>
    )
}
