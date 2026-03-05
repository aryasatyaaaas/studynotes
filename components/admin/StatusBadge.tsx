import { Badge } from "@/components/ui/badge"

export function StatusBadge({ isBanned }: { isBanned: boolean }) {
    return isBanned ? (
        <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 text-[10px]">Banned</Badge>
    ) : (
        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">Aktif</Badge>
    )
}
