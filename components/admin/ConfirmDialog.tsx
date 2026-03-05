"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ConfirmAction {
    type: "ban" | "unban" | "delete" | "promote" | "demote"
    userId: string
    userName: string
}

const actionConfig = {
    ban: {
        title: "Ban Pengguna",
        description: (name: string) => `Pengguna "${name}" tidak akan bisa login sampai di-unban.`,
        buttonLabel: "Ya, Ban",
        buttonClass: "bg-amber text-amber-foreground",
    },
    unban: {
        title: "Unban Pengguna",
        description: (name: string) => `Pengguna "${name}" akan bisa login kembali.`,
        buttonLabel: "Ya, Unban",
        buttonClass: "bg-emerald-500 text-white",
    },
    delete: {
        title: "⚠️ Hapus Permanen",
        description: (name: string) => `Semua data "${name}" (catatan, subjek, file) akan dihapus selamanya. Tindakan ini TIDAK BISA dibatalkan.`,
        buttonLabel: "Hapus Selamanya",
        buttonClass: "bg-rose-500 text-white",
    },
    promote: {
        title: "Jadikan Admin",
        description: (name: string) => `"${name}" akan mendapat akses ke admin panel.`,
        buttonLabel: "Ya, Jadikan Admin",
        buttonClass: "bg-indigo-500 text-white",
    },
    demote: {
        title: "Turunkan ke User",
        description: (name: string) => `"${name}" tidak bisa lagi mengakses admin panel.`,
        buttonLabel: "Ya, Turunkan",
        buttonClass: "bg-muted-foreground text-white",
    },
}

interface ConfirmDialogProps {
    open: boolean
    onClose: () => void
    onConfirm: () => void
    action: ConfirmAction | null
    loading?: boolean
}

export function ConfirmDialog({ open, onClose, onConfirm, action, loading }: ConfirmDialogProps) {
    if (!action) return null
    const config = actionConfig[action.type]

    return (
        <AlertDialog open={open} onOpenChange={v => !v && onClose()}>
            <AlertDialogContent className="border-border bg-card">
                <AlertDialogHeader>
                    <AlertDialogTitle>{config.title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {config.description(action.userName)}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="border-border" disabled={loading}>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className={config.buttonClass}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : config.buttonLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
