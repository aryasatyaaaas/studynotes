import { prisma } from "@/lib/prisma"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Megaphone } from "lucide-react"
import { AnnouncementActions } from "./AnnouncementActions"

const typeConfig = {
    INFO: { label: "Info", className: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
    WARNING: { label: "Warning", className: "bg-amber/10 text-amber border-amber/20" },
    SUCCESS: { label: "Success", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    MAINTENANCE: { label: "Maintenance", className: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
}

export default async function AnnouncementsPage() {
    const announcements = await prisma.announcement.findMany({
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true } } }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-3xl font-semibold flex items-center gap-3">
                        <Megaphone className="h-7 w-7 text-amber" /> Pengumuman
                    </h1>
                    <p className="text-muted-foreground mt-1">{announcements.length} pengumuman</p>
                </div>
                <AnnouncementActions />
            </div>

            <div className="space-y-3">
                {announcements.length === 0 ? (
                    <Card className="border-border bg-card p-8 text-center">
                        <Megaphone className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">Belum ada pengumuman.</p>
                    </Card>
                ) : (
                    announcements.map(ann => {
                        const tc = typeConfig[ann.type as keyof typeof typeConfig] || typeConfig.INFO
                        return (
                            <Card key={ann.id} className={`border p-5 ${ann.isActive ? "border-amber/20 bg-amber/[0.02]" : "border-border opacity-60"}`}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <Badge className={`text-[10px] ${tc.className}`}>{tc.label}</Badge>
                                            {ann.isActive ? (
                                                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">Aktif</Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-[10px] border-border">Nonaktif</Badge>
                                            )}
                                            {ann.expiresAt && (
                                                <span className="text-xs text-muted-foreground">
                                                    Berakhir: {new Date(ann.expiresAt).toLocaleDateString("id-ID")}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-medium">{ann.title}</h3>
                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ann.message}</p>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Oleh {ann.author.name} · {new Date(ann.createdAt).toLocaleDateString("id-ID")}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        )
                    })
                )}
            </div>
        </div>
    )
}
