import { getServerMetrics } from "@/lib/admin/getServerMetrics"
import { ServerMetricCard } from "@/components/admin/ServerMetricCard"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Server } from "lucide-react"
import Link from "next/link"

export default async function ServerPage() {
    const metrics = await getServerMetrics()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-3xl font-semibold flex items-center gap-3">
                        <Server className="h-7 w-7 text-amber" /> Server Monitor
                    </h1>
                    <p className="text-muted-foreground mt-1">Monitoring infrastruktur server</p>
                </div>
                <Badge className={metrics.cpuPercent < 60 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"}>
                    {metrics.cpuPercent < 60 ? "● Sehat" : "● Load Tinggi"}
                </Badge>
            </div>

            {/* Gauges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ServerMetricCard label="CPU" percent={metrics.cpuPercent} detail={`${metrics.cpuCores} cores`} />
                <ServerMetricCard label="RAM" percent={metrics.ramPercent} detail={`${metrics.ramUsedGB} / ${metrics.ramTotalGB} GB`} />
                <ServerMetricCard label="Disk" percent={metrics.diskPercent} detail={`${metrics.diskUsedGB} / ${metrics.diskTotalGB} GB`} />
            </div>

            {/* System info */}
            <Card className="border-border bg-card p-6">
                <h2 className="font-medium mb-4">Informasi Sistem</h2>
                <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                    {[
                        { label: "Platform", value: metrics.platform },
                        { label: "Node.js", value: metrics.nodeVersion },
                        { label: "Uptime", value: metrics.uptime },
                        { label: "Load Average", value: metrics.loadAvg.join(" / ") },
                        { label: "CPU Model", value: metrics.cpuModel },
                        { label: "CPU Cores", value: String(metrics.cpuCores) },
                    ].map(({ label, value }) => (
                        <div key={label}>
                            <dt className="text-muted-foreground text-xs mb-0.5">{label}</dt>
                            <dd className="font-mono text-xs">{value}</dd>
                        </div>
                    ))}
                </dl>
            </Card>

            <p className="text-xs text-muted-foreground text-center">
                Data diperbarui setiap kali halaman dimuat · <Link href="/admin/server" className="text-amber hover:underline">Refresh</Link>
            </p>
        </div>
    )
}
