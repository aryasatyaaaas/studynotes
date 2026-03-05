"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    MoreHorizontal, Ban, CheckCircle2, ShieldCheck,
    ShieldOff, Trash2,
} from "lucide-react"

interface UserActionProps {
    user: { id: string; name: string; role: "USER" | "ADMIN" | "SUPER_ADMIN"; isBanned: boolean }
    currentUserRole: "ADMIN" | "SUPER_ADMIN"
}

type ActionType = "ban" | "unban" | "delete" | "promote" | "demote"

export function UserActions({ user, currentUserRole }: UserActionProps) {
    const router = useRouter()
    const [confirm, setConfirm] = useState<{ type: ActionType; userId: string; userName: string } | null>(null)
    const [loading, setLoading] = useState(false)

    const handleAction = async () => {
        if (!confirm) return
        setLoading(true)
        try {
            const { type, userId } = confirm
            if (type === "ban" || type === "unban") {
                await fetch(`/api/admin/users/${userId}/ban`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: type }),
                })
            } else if (type === "promote" || type === "demote") {
                await fetch(`/api/admin/users/${userId}/role`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: type }),
                })
            } else if (type === "delete") {
                await fetch(`/api/admin/users/${userId}`, { method: "DELETE" })
            }
            router.refresh()
        } finally {
            setLoading(false)
            setConfirm(null)
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-border bg-card">
                    {user.isBanned ? (
                        <DropdownMenuItem onClick={() => setConfirm({ type: "unban", userId: user.id, userName: user.name })}>
                            <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-400" /> Unban
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem onClick={() => setConfirm({ type: "ban", userId: user.id, userName: user.name })}>
                            <Ban className="h-4 w-4 mr-2 text-amber" /> Ban Pengguna
                        </DropdownMenuItem>
                    )}

                    {currentUserRole === "SUPER_ADMIN" && (
                        <>
                            <DropdownMenuSeparator className="bg-border" />
                            {user.role === "USER" && (
                                <DropdownMenuItem onClick={() => setConfirm({ type: "promote", userId: user.id, userName: user.name })}>
                                    <ShieldCheck className="h-4 w-4 mr-2 text-indigo-400" /> Jadikan Admin
                                </DropdownMenuItem>
                            )}
                            {user.role === "ADMIN" && (
                                <DropdownMenuItem onClick={() => setConfirm({ type: "demote", userId: user.id, userName: user.name })}>
                                    <ShieldOff className="h-4 w-4 mr-2" /> Turunkan ke User
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator className="bg-border" />
                            <DropdownMenuItem
                                onClick={() => setConfirm({ type: "delete", userId: user.id, userName: user.name })}
                                className="text-rose-400 focus:text-rose-400"
                            >
                                <Trash2 className="h-4 w-4 mr-2" /> Hapus Permanen
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <ConfirmDialog
                open={!!confirm}
                onClose={() => setConfirm(null)}
                onConfirm={handleAction}
                action={confirm}
                loading={loading}
            />
        </>
    )
}
