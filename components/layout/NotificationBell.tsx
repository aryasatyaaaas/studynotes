"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, X, Info, AlertTriangle, CheckCircle, Wrench } from "lucide-react"

interface Notification {
    id: string
    title: string
    message: string
    type: "INFO" | "WARNING" | "SUCCESS" | "MAINTENANCE"
    createdAt: string
}

const typeConfig = {
    INFO: { icon: Info, color: "text-indigo-400", bg: "bg-indigo-500/10", label: "Info" },
    WARNING: { icon: AlertTriangle, color: "text-amber", bg: "bg-amber/10", label: "Peringatan" },
    SUCCESS: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", label: "Sukses" },
    MAINTENANCE: { icon: Wrench, color: "text-rose-400", bg: "bg-rose-500/10", label: "Maintenance" },
}

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [open, setOpen] = useState(false)
    const [dismissed, setDismissed] = useState<Set<string>>(new Set())
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Load dismissed from localStorage
        const saved = localStorage.getItem("dismissed_notifications")
        if (saved) setDismissed(new Set(JSON.parse(saved)))

        fetch("/api/notifications")
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) setNotifications(data)
            })
            .catch(() => { })
    }, [])

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [])

    const dismiss = (id: string) => {
        const next = new Set(dismissed)
        next.add(id)
        setDismissed(next)
        localStorage.setItem("dismissed_notifications", JSON.stringify([...next]))
    }

    const active = notifications.filter(n => !dismissed.has(n.id))
    const count = active.length

    return (
        <div className="relative" ref={ref}>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(!open)}
                className="text-muted-foreground hover:text-foreground relative"
            >
                <Bell className="h-[18px] w-[18px]" />
                {count > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber text-[10px] font-bold text-amber-foreground flex items-center justify-center">
                        {count}
                    </span>
                )}
            </Button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 z-50">
                    <Card className="border-border bg-card shadow-xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                            <p className="text-sm font-medium">Notifikasi</p>
                            {count > 0 && (
                                <Badge className="bg-amber/10 text-amber border-amber/20 text-[10px]">
                                    {count} baru
                                </Badge>
                            )}
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                            {active.length === 0 ? (
                                <div className="py-8 text-center">
                                    <Bell className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">Tidak ada notifikasi</p>
                                </div>
                            ) : (
                                active.map(notif => {
                                    const tc = typeConfig[notif.type] || typeConfig.INFO
                                    const Icon = tc.icon
                                    return (
                                        <div key={notif.id} className="px-4 py-3 border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                                            <div className="flex items-start gap-3">
                                                <div className={`w-8 h-8 rounded-lg ${tc.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                                                    <Icon className={`h-4 w-4 ${tc.color}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <p className="text-sm font-medium truncate">{notif.title}</p>
                                                        <Badge className={`text-[9px] ${tc.bg} ${tc.color} border-transparent shrink-0`}>
                                                            {tc.label}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{notif.message}</p>
                                                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                                                        {new Date(notif.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
                                                    onClick={(e) => { e.stopPropagation(); dismiss(notif.id) }}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    )
}
