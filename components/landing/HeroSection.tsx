"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useReveal } from "@/hooks/useReveal"
import { Github, Lock, Bot, Zap, Sparkles } from "lucide-react"

export function HeroSection() {
    const { ref, visible } = useReveal(0.1)

    return (
        <section ref={ref} className={`min-h-screen flex items-center pt-24 pb-16 px-6 relative overflow-hidden transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {/* Background blobs */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/4 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-emerald-500/3 rounded-full blur-[80px] pointer-events-none" />

            <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto relative z-10">
                {/* Left */}
                <div className="space-y-6">
                    <Badge className="bg-amber/10 text-amber border border-amber/20 rounded-full px-4 py-1 text-sm">
                        ✦ 100% Gratis & Open Source
                    </Badge>

                    <h1 className="font-serif text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight">
                        Catatan Kuliah<br />
                        yang <em className="italic text-amber">Lebih Cerdas</em><br />
                        dari Biasanya.
                    </h1>

                    <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
                        StudyNotes menggabungkan editor rich-text modern, organisasi cerdas per mata kuliah,
                        dan ringkasan AI lokal — dibangun di atas stack open source terbaik.
                        Privasi penuh. Gratis selamanya.
                    </p>

                    <div className="flex gap-3 flex-wrap">
                        <Button size="lg" asChild className="bg-amber text-amber-foreground shadow-[0_8px_32px_rgba(245,158,11,0.28)] hover:opacity-90 hover:-translate-y-0.5 transition-all">
                            <Link href="/register">Mulai Sekarang →</Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild className="border-border hover:border-amber/40 gap-2">
                            <a href="https://github.com/aryasatyaaaas/studynotes" target="_blank" rel="noopener noreferrer">
                                <Github className="h-4 w-4" /> Lihat di GitHub
                            </a>
                        </Button>
                    </div>

                    <div className="flex gap-5 flex-wrap text-sm text-muted-foreground pt-2">
                        <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-amber" /> Privasi penuh</span>
                        <span className="flex items-center gap-1.5"><Bot className="h-3.5 w-3.5 text-amber" /> AI offline (Ollama)</span>
                        <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-amber" /> Next.js 16</span>
                    </div>
                </div>

                {/* Right — Floating Mockup */}
                <div className="relative animate-[float_5s_ease-in-out_infinite] hidden lg:block">
                    <Card className="bg-card border-border shadow-[0_20px_60px_rgba(26,26,46,0.12)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden">
                        {/* Top bar */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                            <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">Algoritma 📐</Badge>
                            <span className="text-xs text-muted-foreground">Auto-saved ✓</span>
                        </div>
                        {/* Note content mockup */}
                        <CardContent className="p-5 space-y-3">
                            <h3 className="font-serif text-lg font-semibold">Kompleksitas Waktu Big-O</h3>
                            <div className="text-sm text-muted-foreground space-y-1 leading-relaxed">
                                <p>Algoritma <strong className="text-foreground">Binary Search</strong> memiliki kompleksitas <code className="bg-muted px-1 rounded text-amber text-xs">O(log n)</code></p>
                                <p><em className="text-emerald-400">Lebih efisien</em> dari Linear Search yang O(n)</p>
                            </div>
                            {/* Tags */}
                            <div className="flex gap-2 pt-1">
                                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">Struktur Data</Badge>
                                <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 text-xs">Ujian</Badge>
                            </div>
                        </CardContent>
                        {/* AI button bar */}
                        <div className="px-5 pb-4">
                            <Button size="sm" className="bg-amber/10 text-amber hover:bg-amber/20 border border-amber/20 w-full text-xs gap-1.5">
                                <Sparkles className="h-3 w-3" /> Rangkum dengan AI
                            </Button>
                        </div>
                    </Card>
                    {/* Amber bottom glow */}
                    <div className="absolute -bottom-4 inset-x-12 h-8 bg-amber/20 blur-xl rounded-full" />
                </div>
            </div>
        </section>
    )
}
