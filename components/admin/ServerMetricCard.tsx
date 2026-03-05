import { Card } from "@/components/ui/card"

interface ServerMetricCardProps {
    label: string
    percent: number
    detail: string
}

export function ServerMetricCard({ label, percent, detail }: ServerMetricCardProps) {
    const radius = 40
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (percent / 100) * circumference
    const color = percent > 85 ? "text-rose-400" : percent > 60 ? "text-amber" : "text-emerald-400"
    const stroke = percent > 85 ? "#fb7185" : percent > 60 ? "#f59e0b" : "#34d399"

    return (
        <Card className="border-border bg-card p-5 flex flex-col items-center">
            <svg width="100" height="100" viewBox="0 0 100 100" className="mb-3">
                <circle
                    cx="50" cy="50" r={radius}
                    fill="none"
                    stroke="currentColor"
                    className="text-muted"
                    strokeWidth="6"
                />
                <circle
                    cx="50" cy="50" r={radius}
                    fill="none"
                    stroke={stroke}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transform="rotate(-90 50 50)"
                    className="transition-all duration-500"
                />
                <text x="50" y="50" textAnchor="middle" dominantBaseline="central" className="font-serif text-lg font-bold fill-current">
                    {percent}%
                </text>
            </svg>
            <p className={`font-medium text-sm ${color}`}>{label}</p>
            <p className="text-xs text-muted-foreground text-center mt-0.5">{detail}</p>
        </Card>
    )
}
