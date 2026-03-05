import { prisma } from "@/lib/prisma"
import { StatCard } from "@/components/admin/StatCard"
import { Card } from "@/components/ui/card"
import { HardDrive, Image, FileText, Files } from "lucide-react"

function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

export default async function StoragePage() {
    const attachments = await prisma.attachment.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
        select: {
            id: true, filename: true, size: true, mimeType: true, createdAt: true,
            note: {
                select: {
                    id: true, title: true,
                    user: { select: { name: true, email: true } }
                }
            }
        }
    })

    const totalSize = attachments.reduce((acc, a) => acc + a.size, 0)
    const imageCount = attachments.filter(a => a.mimeType.startsWith("image/")).length
    const pdfCount = attachments.filter(a => a.mimeType === "application/pdf").length

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-serif text-3xl font-semibold flex items-center gap-3">
                    <HardDrive className="h-7 w-7 text-amber" /> Storage
                </h1>
                <p className="text-muted-foreground mt-1">Kelola file dan lampiran pengguna</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <StatCard title="Total File" value={attachments.length} icon={Files} />
                <StatCard title="Total Ukuran" value={formatBytes(totalSize)} icon={HardDrive} />
                <StatCard title="Gambar / PDF" value={`${imageCount} / ${pdfCount}`} icon={Image} />
            </div>

            <Card className="border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border text-muted-foreground">
                                <th className="text-left py-3 px-5 font-medium">File</th>
                                <th className="text-left py-3 px-3 font-medium">Tipe</th>
                                <th className="text-left py-3 px-3 font-medium">Ukuran</th>
                                <th className="text-left py-3 px-3 font-medium">Pengguna</th>
                                <th className="text-left py-3 px-3 font-medium">Catatan</th>
                                <th className="text-left py-3 px-3 font-medium">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {attachments.map(att => (
                                <tr key={att.id} className="hover:bg-muted/30">
                                    <td className="py-3 px-5">
                                        <div className="flex items-center gap-2">
                                            {att.mimeType.startsWith("image/") ? (
                                                <Image className="h-4 w-4 text-indigo-400 shrink-0" />
                                            ) : (
                                                <FileText className="h-4 w-4 text-amber shrink-0" />
                                            )}
                                            <span className="truncate max-w-[200px]">{att.filename}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3 text-muted-foreground text-xs">{att.mimeType}</td>
                                    <td className="py-3 px-3 text-muted-foreground">{formatBytes(att.size)}</td>
                                    <td className="py-3 px-3 text-muted-foreground text-xs">{att.note.user.email}</td>
                                    <td className="py-3 px-3 text-xs truncate max-w-[150px]">{att.note.title}</td>
                                    <td className="py-3 px-3 text-muted-foreground text-xs">
                                        {new Date(att.createdAt).toLocaleDateString("id-ID")}
                                    </td>
                                </tr>
                            ))}
                            {attachments.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-muted-foreground">Belum ada file yang diupload.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
