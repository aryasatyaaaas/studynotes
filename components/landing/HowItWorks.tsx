"use client"

import { useReveal } from "@/hooks/useReveal"
import { Badge } from "@/components/ui/badge"
import { Package, PenLine, Bot } from "lucide-react"

const steps = [
    {
        icon: Package,
        title: "Install",
        desc: "Jalankan Docker Compose lalu npm run dev. Semua siap dalam 2 menit.",
        code: "docker compose up -d",
    },
    {
        icon: PenLine,
        title: "Tulis",
        desc: "Buat catatan di Tiptap Editor, upload gambar ke MinIO, organisasi per mata kuliah dengan tag warna-warni.",
    },
    {
        icon: Bot,
        title: "Rangkum",
        desc: "Klik AI Summary. Vercel AI SDK streaming token Ollama langsung ke UI dalam Bahasa Indonesia.",
    },
]

export function HowItWorks() {
    const { ref, visible } = useReveal()

    return (
        <section id="cara-kerja" ref={ref} className={`py-24 px-6 bg-muted/20 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="text-center mb-16 space-y-3">
                <Badge variant="outline" className="text-amber border-amber/30 rounded-full">✦ Mulai dalam Menit</Badge>
                <h2 className="font-serif text-4xl font-semibold">
                    Cara Kerjanya <em className="italic text-amber">Simpel</em>
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto relative">
                {/* Dashed connecting line */}
                <div className="hidden md:block absolute top-10 left-[calc(33%+2rem)] right-[calc(33%+2rem)] h-px border-t-2 border-dashed border-amber/25" />

                {steps.map((step, i) => {
                    const Icon = step.icon
                    return (
                        <div key={step.title} className="relative text-center space-y-4 group" style={{ transitionDelay: `${i * 150}ms` }}>
                            <div className="w-20 h-20 rounded-2xl bg-amber/10 border border-amber/20 flex items-center justify-center mx-auto group-hover:bg-amber/15 group-hover:border-amber/40 transition-all">
                                <Icon className="h-8 w-8 text-amber" />
                            </div>
                            <h3 className="font-serif text-xl font-semibold">{step.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                            {step.code && (
                                <code className="inline-block text-xs bg-muted border border-border px-3 py-1.5 rounded-lg text-amber font-mono">
                                    {step.code}
                                </code>
                            )}
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
