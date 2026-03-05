"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { useReveal } from "@/hooks/useReveal"
import { PenLine, Sparkles, FolderOpen, Search, FileDown, MonitorSmartphone } from "lucide-react"

const features = [
    {
        icon: PenLine,
        title: "Editor Rich Text Bertenaga Tiptap",
        desc: "Tulis dengan format lengkap — heading, bold, italic, kode, tabel, dan gambar. Paste screenshot slide langsung ke editor. Auto-save setiap 2 detik via use-debounce.",
        colSpan: "lg:col-span-2",
        accent: true,
        visual: (
            <div className="flex gap-1.5 flex-wrap">
                {["B", "I", "</>", "H1", "H2", "≡", "⌘", "🖼"].map(t => (
                    <Badge key={t} variant="outline" className="text-xs px-2 border-border">{t}</Badge>
                ))}
            </div>
        ),
    },
    {
        icon: Sparkles,
        title: "Ringkasan AI Lokal",
        desc: "Satu klik, catatan panjang jadi poin-poin inti. Diproses lokal via Ollama + Vercel AI SDK — streaming real-time, zero cost, privasi terjaga.",
        visual: (
            <div className="space-y-2">
                <div className="text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
                        Generating...
                    </span>
                </div>
                <p className="text-xs text-muted-foreground">• Kompleksitas waktu O(log n)...</p>
                <Badge className="bg-emerald-500/10 text-emerald-400 text-xs border-emerald-500/20">🔒 Offline · Bahasa Indonesia</Badge>
            </div>
        ),
    },
    {
        icon: FolderOpen,
        title: "Organisasi per Mata Kuliah",
        desc: "Kelompokkan catatan ke folder mata kuliah dengan warna dan emoji unik. Didukung Prisma + PostgreSQL.",
        iconColor: "text-indigo-400",
        visual: (
            <div className="flex gap-2 flex-wrap">
                <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-xs">Algoritma 📐</Badge>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">Biologi 🌿</Badge>
                <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 text-xs">Sejarah 📜</Badge>
            </div>
        ),
    },
    {
        icon: Search,
        title: "Pencarian Instan",
        desc: "Cari jutaan kata catatan dalam milidetik — didukung PostgreSQL TSVector Full-Text Search via Prisma.",
        iconColor: "text-emerald-400",
        visual: (
            <div className="space-y-2">
                <div className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                    🔍 fotosintesis
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                    <p>Biologi — Proses <mark className="bg-amber/20 text-amber rounded px-0.5">fotosintesis</mark> mengubah CO₂...</p>
                    <p>Kimia — Reaksi <mark className="bg-amber/20 text-amber rounded px-0.5">fotosintesis</mark> dalam sel...</p>
                </div>
            </div>
        ),
    },
    {
        icon: FileDown,
        title: "Export ke PDF",
        desc: "Cetak atau bagikan catatan lengkap dengan gambar dalam satu klik via html2pdf.js — berjalan sepenuhnya di browser.",
        iconColor: "text-rose-400",
    },
    {
        icon: MonitorSmartphone,
        title: "Tema & Responsif",
        desc: "Dark / Light mode instan. Bottom navigation bar khusus mobile. Tampilan sempurna di semua ukuran layar.",
        iconColor: "text-violet-400",
        visual: (
            <div className="rounded-lg overflow-hidden flex h-10 border border-border">
                <div className="w-1/2 bg-foreground" />
                <div className="w-1/2 bg-background border-l border-border" />
            </div>
        ),
    },
]

export function FeaturesSection() {
    const { ref, visible } = useReveal()

    return (
        <section id="features" ref={ref} className={`py-24 px-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="text-center mb-16 space-y-3">
                <Badge variant="outline" className="text-amber border-amber/30 rounded-full">✦ Fitur Lengkap</Badge>
                <h2 className="font-serif text-4xl font-semibold">
                    Semua yang Kamu Butuhkan<br />
                    untuk <em className="italic text-amber">Belajar Lebih Baik</em>
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Dari editor kelas dunia hingga AI ringkasan lokal — semua ada di satu tempat.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
                {features.map((feat, index) => {
                    const Icon = feat.icon
                    return (
                        <Card
                            key={feat.title}
                            className={`group border-border bg-card hover:border-amber/30 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 cursor-default ${feat.colSpan || ""} ${feat.accent ? "border-l-2 border-l-amber" : ""}`}
                            style={{ transitionDelay: `${index * 80}ms` }}
                        >
                            <CardHeader className="pb-3">
                                <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center mb-2">
                                    <Icon className={`h-5 w-5 ${feat.iconColor || "text-amber"}`} />
                                </div>
                                <CardTitle className="font-serif text-base">{feat.title}</CardTitle>
                                <CardDescription className="text-muted-foreground text-sm leading-relaxed">{feat.desc}</CardDescription>
                            </CardHeader>
                            {feat.visual && <CardContent>{feat.visual}</CardContent>}
                        </Card>
                    )
                })}
            </div>
        </section>
    )
}
