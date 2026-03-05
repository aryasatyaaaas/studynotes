"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAppStore } from "@/store/useAppStore"
import { Sun, Moon, Menu } from "lucide-react"

const navLinks = [
    { label: "Fitur", href: "#features" },
    { label: "Cara Kerja", href: "#cara-kerja" },
    { label: "Dokumentasi", href: "/docs/self-host" },
    { label: "FAQ", href: "#faq" },
    { label: "GitHub", href: "https://github.com/aryasatyaaaas/studynotes" },
]

export function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const { theme, setTheme } = useAppStore()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

    return (
        <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${scrolled ? "backdrop-blur-md bg-background/80 border-b border-border" : ""}`}>
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-serif text-xl font-semibold">
                    <span className="w-2 h-2 rounded-full bg-amber inline-block" />
                    StudyNotes
                </Link>

                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map(link => (
                        <Button key={link.label} variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                            <a href={link.href}>{link.label}</a>
                        </Button>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={toggleTheme}>
                        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </Button>
                    <Button asChild className="hidden sm:flex bg-amber text-amber-foreground hover:opacity-90">
                        <Link href="/register">Mulai Gratis →</Link>
                    </Button>

                    <Sheet>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-72 p-0">
                            <div className="flex flex-col h-full">
                                {/* Header */}
                                <div className="px-6 pt-6 pb-4 border-b border-border">
                                    <Link href="/" className="flex items-center gap-2 font-serif text-lg font-semibold">
                                        <span className="w-2 h-2 rounded-full bg-amber inline-block" />
                                        StudyNotes
                                    </Link>
                                </div>

                                {/* Nav links */}
                                <nav className="flex-1 px-4 py-4 space-y-1">
                                    {navLinks.map(link => (
                                        <a
                                            key={link.label}
                                            href={link.href}
                                            className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                    ))}
                                </nav>

                                {/* CTA */}
                                <div className="px-4 pb-6">
                                    <Button asChild className="w-full bg-amber text-amber-foreground hover:opacity-90">
                                        <Link href="/register">Mulai Gratis →</Link>
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
