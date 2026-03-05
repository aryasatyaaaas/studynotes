"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Server, Settings, Database, HardDrive, Bot, Package, Globe, ShieldCheck, HelpCircle, GitCommit } from "lucide-react"

const sidebarNav = [
    {
        group: "Memulai",
        items: [
            { label: "Pengantar", href: "/docs", icon: BookOpen },
            { label: "Self-Host Guide", href: "/docs/self-host", icon: Server },
        ],
    },
    {
        group: "Konfigurasi",
        items: [
            { label: "Environment Variables", href: "/docs/env-vars", icon: Settings },
            { label: "Database", href: "/docs/database", icon: Database },
            { label: "MinIO Storage", href: "/docs/storage", icon: HardDrive },
            { label: "Ollama AI", href: "/docs/ai", icon: Bot },
        ],
    },
    {
        group: "Deployment",
        items: [
            { label: "Docker Compose", href: "/docs/docker", icon: Package },
            { label: "VPS Ubuntu", href: "/docs/vps", icon: Globe },
            { label: "Nginx + SSL", href: "/docs/nginx", icon: ShieldCheck },
        ],
    },
    {
        group: "Lainnya",
        items: [
            { label: "FAQ", href: "/docs/faq", icon: HelpCircle },
            { label: "Changelog", href: "/docs/changelog", icon: GitCommit },
        ],
    },
]

export function DocsSidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden lg:block sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto w-56 shrink-0 border-r border-border py-6 px-3">
            {sidebarNav.map((section) => (
                <div key={section.group} className="mb-6">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
                        {section.group}
                    </p>
                    <nav className="space-y-0.5">
                        {section.items.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${isActive
                                            ? "bg-amber/10 text-amber border-r-2 border-amber font-medium"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                        }`}
                                >
                                    <Icon className="h-4 w-4 shrink-0" />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>
                </div>
            ))}
        </aside>
    )
}
