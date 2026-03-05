"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DocsSidebar } from "@/components/docs/DocsSidebar"
import { ScrollProgress } from "@/components/landing/ScrollProgress"
import { useAppStore } from "@/store/useAppStore"
import { Sun, Moon } from "lucide-react"

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    const { theme, setTheme } = useAppStore()
    const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

    return (
        <div className="min-h-screen bg-background text-foreground">
            <ScrollProgress />

            <header className="fixed top-0 inset-x-0 z-40 h-14 border-b border-border bg-background/90 backdrop-blur-md flex items-center px-6 justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 font-serif font-semibold text-lg">
                        <span className="w-2 h-2 rounded-full bg-amber" /> StudyNotes
                    </Link>
                    <span className="text-border">|</span>
                    <span className="text-sm text-muted-foreground">Dokumentasi</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={toggleTheme}>
                        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" className="bg-amber text-amber-foreground hover:opacity-90" asChild>
                        <Link href="/register">Mulai Gratis →</Link>
                    </Button>
                </div>
            </header>

            <div className="flex pt-14 max-w-7xl mx-auto">
                <DocsSidebar />
                <main className="flex-1 min-w-0 px-6 py-10 lg:px-12">
                    {children}
                </main>
            </div>
        </div>
    )
}
