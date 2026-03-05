import { Badge } from "@/components/ui/badge"

type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN"

const config: Record<UserRole, { label: string; className: string }> = {
    USER: { label: "User", className: "bg-muted text-muted-foreground border-border" },
    ADMIN: { label: "Admin", className: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
    SUPER_ADMIN: { label: "Super Admin", className: "bg-amber/10 text-amber border-amber/20" },
}

export function RoleBadge({ role }: { role: UserRole }) {
    const c = config[role]
    return <Badge className={`text-[10px] ${c.className}`}>{c.label}</Badge>
}
