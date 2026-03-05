"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { AlertBlock } from "@/components/docs/AlertBlock"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { ChevronRight, HelpCircle } from "lucide-react"

const faqGroups = [
    {
        title: "Umum",
        items: [
            { q: "Apakah StudyNotes gratis?", a: "Ya, 100% gratis dan open source. Kamu bisa menggunakan layanan cloud kami atau self-host sendiri tanpa biaya." },
            { q: "Apa bedanya mode Cloud dan Self-Host?", a: "Cloud: daftar, langsung pakai. Self-Host: kamu menjalankan semua komponen (Next.js, PostgreSQL, MinIO, Ollama) di mesinmu sendiri. Fitur keduanya identik." },
            { q: "Apakah bisa dipakai di HP?", a: "Ya, tampilan responsif dan dioptimalkan untuk semua ukuran layar termasuk mobile." },
        ],
    },
    {
        title: "Self-Hosting",
        items: [
            { q: "Spesifikasi minimum untuk self-host?", a: "2 vCPU, 4 GB RAM, 20 GB storage tanpa AI. Dengan Ollama AI: 4 vCPU, 8 GB RAM, 40 GB storage." },
            { q: "OS apa saja yang didukung?", a: "Ubuntu 22.04/24.04, Debian 12, macOS 13+, Windows 11 + WSL2, dan Arch Linux." },
            { q: "Bisa tanpa Docker?", a: "Secara teknis bisa, tapi sangat tidak direkomendasikan. Docker mempermudah setup PostgreSQL, MinIO, dan Ollama secara signifikan." },
            { q: "Bagaimana cara update ke versi baru?", a: "git pull origin main → npm install → npx prisma migrate deploy → npm run build && npm start." },
        ],
    },
    {
        title: "Keamanan",
        items: [
            { q: "Bagaimana autentikasi ditangani?", a: "Better Auth dengan session httpOnly cookie, rate limiting, dan hashing password otomatis." },
            { q: "Apakah data dienkripsi?", a: "Data in-transit dilindungi HTTPS (jika setup Nginx + SSL). Di self-host, kamu mengontrol enkripsi at-rest di level database/OS." },
            { q: "Bagaimana mencegah orang lain mendaftar?", a: "Set AUTH_REGISTRATION_OPEN=false di .env setelah membuat akun pertama." },
        ],
    },
    {
        title: "AI",
        items: [
            { q: "AI butuh internet?", a: "Di self-host: tidak, AI berjalan offline via Ollama. Di cloud: diproses di server kami." },
            { q: "Model apa yang digunakan?", a: "Default: llama3.2 (~2 GB). Alternatif ringan: llama3.2:1b (~1.1 GB)." },
            { q: "Bisa pakai model lain?", a: "Ya, model apapun yang didukung Ollama. Download model, lalu ubah AI_MODEL di .env." },
            { q: "Bisa tanpa fitur AI?", a: "Ya, stop container Ollama saja. Semua fitur lain tetap berfungsi normal." },
        ],
    },
]

export default function FaqDocsPage() {
    return (
        <article className="max-w-3xl">
            <div className="mb-10 pb-8 border-b border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Link href="/docs" className="hover:text-foreground transition-colors">Dokumentasi</Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-foreground">FAQ</span>
                </div>
                <h1 className="font-serif text-4xl font-semibold mb-3">FAQ</h1>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                    Pertanyaan yang sering ditanyakan seputar StudyNotes, self-hosting, keamanan, dan fitur AI.
                </p>
                <Badge variant="outline" className="mt-4 border-amber/30 text-amber">
                    <HelpCircle className="h-3 w-3 mr-1" /> FAQ
                </Badge>
            </div>

            {faqGroups.map((group) => (
                <section key={group.title} className="mb-10">
                    <h2 className="font-serif text-xl font-semibold mb-4">{group.title}</h2>
                    <Accordion type="single" collapsible className="space-y-2">
                        {group.items.map(({ q, a }) => (
                            <AccordionItem key={q} value={q} className="border border-border rounded-xl px-6 bg-card data-[state=open]:border-amber/30">
                                <AccordionTrigger className="font-medium text-sm text-left hover:no-underline py-4">
                                    {q}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-sm pb-4 leading-relaxed">
                                    {a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </section>
            ))}

            <AlertBlock type="tip">
                Tidak menemukan jawaban? Buka issue di <a href="https://github.com/aryasatyaaaas/studynotes/issues" target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">GitHub</a>.
            </AlertBlock>
        </article>
    )
}
