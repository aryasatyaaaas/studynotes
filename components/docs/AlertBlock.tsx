import { Info, AlertTriangle, Lightbulb, XCircle } from "lucide-react"

type AlertType = "info" | "warning" | "tip" | "danger"

const alertConfig = {
    info: { icon: Info, bg: "bg-indigo-500/5", border: "border-indigo-500/20", text: "text-indigo-400", label: "Info" },
    warning: { icon: AlertTriangle, bg: "bg-amber/5", border: "border-amber/20", text: "text-amber", label: "Perhatian" },
    tip: { icon: Lightbulb, bg: "bg-emerald-500/5", border: "border-emerald-500/20", text: "text-emerald-400", label: "Tips" },
    danger: { icon: XCircle, bg: "bg-rose-500/5", border: "border-rose-500/20", text: "text-rose-400", label: "Penting" },
}

export function AlertBlock({ type = "info", children }: { type?: AlertType; children: React.ReactNode }) {
    const { icon: Icon, bg, border, text, label } = alertConfig[type]
    return (
        <div className={`rounded-lg border ${border} ${bg} p-4 my-4 flex gap-3`}>
            <Icon className={`h-5 w-5 ${text} shrink-0 mt-0.5`} />
            <div>
                <p className={`font-medium text-sm ${text} mb-1`}>{label}</p>
                <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
            </div>
        </div>
    )
}
