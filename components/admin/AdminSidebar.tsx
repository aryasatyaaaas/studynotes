"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
    LayoutDashboard, Users, HardDrive, Megaphone,
    Settings, Server, Shield, ChevronRight
} from "lucide-react"

const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard, desc: "Statistik & overview", superOnly: false },
    { label: "Pengguna", href: "/admin/users", icon: Users, desc: "Kelola akun pengguna", superOnly: false },
    { label: "Storage", href: "/admin/storage", icon: HardDrive, desc: "File & lampiran", superOnly: false },
    { label: "Pengumuman", href: "/admin/announcements", icon: Megaphone, desc: "Broadcast ke semua user", superOnly: false },
    { label: "Server", href: "/admin/server", icon: Server, desc: "Monitoring infrastruktur", superOnly: false },
    { label: "Pengaturan", href: "/admin/settings", icon: Settings, desc: "Konfigurasi aplikasi", superOnly: true },
]

export function AdminSidebar({ userRole }: { userRole: string }) {
    const pathname = usePathname()

    const filtered = navItems.filter(item => !item.superOnly || userRole === "SUPER_ADMIN")

    return (
        <aside className="w-64 shrink-0 min-h-screen border-r border-border bg-card flex flex-col hidden lg:flex">
            {/* Logo */}
            <div className="h-16 flex items-center gap-3 px-5 border-b border-border">
                <div className="w-8 h-8 rounded-lg bg-amber/15 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-amber" />
                </div>
                <div>
                    <p className="font-serif font-semibold text-sm">Admin Panel</p>
                    <p className="text-xs text-muted-foreground">StudyNotes</p>
                </div>
            </div>

            {/* Role */}
            <div className="px-5 py-3 border-b border-border">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${userRole === "SUPER_ADMIN" ? "bg-amber/10 text-amber" : "bg-indigo-500/10 text-indigo-400"
                    }`}>
                    {userRole === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                </span>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 px-3 space-y-1">
                {filtered.map(item => {
                    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href + "/"))
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group
                                ${isActive
                                    ? "bg-amber/10 text-amber border border-amber/20"
                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                }`}
                        >
                            <item.icon className="h-4 w-4 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{item.label}</p>
                                <p className="text-xs opacity-70 truncate">{item.desc}</p>
                            </div>
                            {item.superOnly && <Shield className="h-3 w-3 text-amber shrink-0" />}
                            {isActive && <ChevronRight className="h-3 w-3 shrink-0" />}
                        </Link>
                    )
                })}
            </nav>

        </aside>
    )
}
