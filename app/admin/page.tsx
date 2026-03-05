import { prisma } from "@/lib/prisma"
import { StatCard } from "@/components/admin/StatCard"
import { ServerMetricCard } from "@/components/admin/ServerMetricCard"
import { getServerMetrics } from "@/lib/admin/getServerMetrics"
import { Card } from "@/components/ui/card"
import { Users, FileText, HardDrive, UserX, Clock, Server } from "lucide-react"

export default async function AdminDashboardPage() {
    const today = new Date(new Date().setHours(0, 0, 0, 0))

    // Fetch stats with fallbacks for PrismaPg adapter compatibility
    const totalUsers = await prisma.user.count().catch(() => 0)
    const bannedUsers = await prisma.user.count({ where: { isBanned: true } }).catch(() => 0)
    const totalNotes = await prisma.note.count().catch(() => 0)
    const totalAttachments = await prisma.attachment.count().catch(() => 0)
    const storageUsed = await prisma.attachment.aggregate({ _sum: { size: true } }).catch(() => ({ _sum: { size: 0 } }))
    const newUsersToday = await prisma.user.count({ where: { createdAt: { gte: today } } }).catch(() => 0)
    const serverMetrics = await getServerMetrics()

    const storageMB = Math.round(((storageUsed._sum.size as number | null) ?? 0) / 1024 / 1024)
    const activeUsers = totalUsers - bannedUsers
    const newNotesToday = 0 // Privacy: admin hanya lihat aggregate count

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-serif text-3xl font-semibold">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                    Overview aplikasi StudyNotes — {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
            </div>

            {/* Primary stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Pengguna" value={totalUsers} delta={`+${newUsersToday} hari ini`} icon={Users} trend="up" />
                <StatCard title="Total Catatan" value={totalNotes} delta={`+${newNotesToday} hari ini`} icon={FileText} trend="up" />
                <StatCard title="Storage" value={`${storageMB} MB`} delta={`${totalAttachments} file`} icon={HardDrive} />
                <StatCard title="Banned" value={bannedUsers} delta={`${activeUsers} aktif`} icon={UserX} trend={bannedUsers > 0 ? "down" : "neutral"} />
            </div>

            {/* Server health */}
            <div>
                <h2 className="font-serif text-xl font-semibold mb-4">Kesehatan Server</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ServerMetricCard label="CPU" percent={serverMetrics.cpuPercent} detail={`${serverMetrics.cpuCores} cores`} />
                    <ServerMetricCard label="RAM" percent={serverMetrics.ramPercent} detail={`${serverMetrics.ramUsedGB} / ${serverMetrics.ramTotalGB} GB`} />
                    <ServerMetricCard label="Disk" percent={serverMetrics.diskPercent} detail={`${serverMetrics.diskUsedGB} / ${serverMetrics.diskTotalGB} GB`} />
                </div>
            </div>

            {/* System info — privacy-safe, no user content */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-border bg-card p-4 text-center">
                    <Clock className="h-5 w-5 text-amber mx-auto mb-2" />
                    <p className="text-xl font-serif font-bold text-amber">{serverMetrics.uptime}</p>
                    <p className="text-xs text-muted-foreground mt-1">Uptime</p>
                </Card>
                <Card className="border-border bg-card p-4 text-center">
                    <Server className="h-5 w-5 text-amber mx-auto mb-2" />
                    <p className="text-xl font-serif font-bold text-amber">{serverMetrics.nodeVersion}</p>
                    <p className="text-xs text-muted-foreground mt-1">Node.js</p>
                </Card>
                <Card className="border-border bg-card p-4 text-center">
                    <HardDrive className="h-5 w-5 text-amber mx-auto mb-2" />
                    <p className="text-xl font-serif font-bold text-amber">{totalAttachments}</p>
                    <p className="text-xs text-muted-foreground mt-1">Total File</p>
                </Card>
                <Card className="border-border bg-card p-4 text-center">
                    <Users className="h-5 w-5 text-amber mx-auto mb-2" />
                    <p className="text-xl font-serif font-bold text-amber">{activeUsers}</p>
                    <p className="text-xs text-muted-foreground mt-1">User Aktif</p>
                </Card>
            </div>

            {/* Privacy notice */}
            <Card className="border-border bg-card p-4">
                <p className="text-xs text-muted-foreground text-center">
                    🔒 Admin panel hanya menampilkan statistik agregat. Konten catatan dan data pribadi pengguna tidak dapat diakses oleh admin.
                </p>
            </Card>
        </div>
    )
}
