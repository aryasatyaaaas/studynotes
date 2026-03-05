"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/store/useAppStore"
import { Sun, Moon, ArrowLeft, Shield } from "lucide-react"

interface AdminTopbarProps {
    userName: string
    userEmail: string
}

export function AdminTopbar({ userName, userEmail }: AdminTopbarProps) {
    const { theme, setTheme } = useAppStore()
    const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

    return (
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-3 lg:hidden">
                <Link href="/admin" className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-amber" />
                    <span className="font-serif font-semibold">Admin</span>
                </Link>
            </div>

            <div className="hidden lg:block">
                <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
            </div>

            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
                    {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>

                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber/15 flex items-center justify-center text-sm font-medium text-amber">
                        {userName?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-medium leading-none">{userName}</p>
                        <p className="text-xs text-muted-foreground">{userEmail}</p>
                    </div>
                </div>

                <Button variant="ghost" size="sm" asChild className="text-muted-foreground gap-1.5 hidden md:flex">
                    <Link href="/dashboard">
                        <ArrowLeft className="h-3.5 w-3.5" /> App
                    </Link>
                </Button>
            </div>
        </header>
    )
}
