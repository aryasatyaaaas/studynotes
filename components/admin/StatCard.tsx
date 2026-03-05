import { Card } from "@/components/ui/card"
import { TrendingUp, type LucideIcon } from "lucide-react"

interface StatCardProps {
    title: string
    value: string | number
    delta?: string
    icon: LucideIcon
    iconColor?: string
    trend?: "up" | "down" | "neutral"
    gauge?: { value: number; max: number }
}

export function StatCard({ title, value, delta, icon: Icon, iconColor = "text-amber", trend, gauge }: StatCardProps) {
    return (
        <Card className="border-border bg-card p-5">
            <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg bg-amber/10 flex items-center justify-center`}>
                    <Icon className={`h-4 w-4 ${iconColor}`} />
                </div>
                {trend && (
                    <TrendingUp className={`h-4 w-4 ${trend === "up" ? "text-emerald-400" : trend === "down" ? "text-rose-400 rotate-180" : "text-muted-foreground"}`} />
                )}
            </div>
            <p className="font-serif text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{title}</p>
            {delta && <p className="text-xs text-emerald-400 mt-1">{delta}</p>}
            {gauge && (
                <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all ${gauge.value > 85 ? "bg-rose-400" : gauge.value > 60 ? "bg-amber" : "bg-emerald-400"}`}
                        style={{ width: `${(gauge.value / gauge.max) * 100}%` }}
                    />
                </div>
            )}
        </Card>
    )
}
