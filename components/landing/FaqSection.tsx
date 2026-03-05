"use client"

import { Badge } from "@/components/ui/badge"
import { useReveal } from "@/hooks/useReveal"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
    {
        q: "Apakah StudyNotes benar-benar gratis?",
        a: "Ya, 100% gratis dan open source. Kamu bisa langsung daftar dan menggunakan server kami, atau self-host di mesinmu sendiri — tanpa biaya apapun.",
    },
    {
        q: "Apakah data catatan saya aman?",
        a: "Di mode cloud, data disimpan di server kami dengan enkripsi dan autentikasi Better Auth. Di mode self-host, semua data tersimpan di server yang kamu kelola sendiri — kontrol penuh ada di tanganmu.",
    },
    {
        q: "Apa bedanya mode Cloud dan Self-Host?",
        a: "Mode Cloud: daftar, langsung pakai — tanpa install apapun. Mode Self-Host: kamu menjalankan seluruh stack (Next.js, PostgreSQL, MinIO, Ollama) di mesinmu sendiri. Keduanya gratis dan fiturnya sama.",
    },
    {
        q: "Apakah fitur AI-nya butuh koneksi internet?",
        a: "Tergantung mode. Di self-host, AI berjalan lokal via Ollama — sepenuhnya offline. Di mode cloud, AI diproses di server kami. Keduanya menggunakan Vercel AI SDK untuk streaming real-time.",
    },
    {
        q: "Teknologi apa saja yang digunakan?",
        a: "Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui, Tiptap, PostgreSQL, Prisma, Better Auth, Zod, MinIO, Ollama, Vercel AI SDK, Zustand, SWR — semuanya open source dan gratis.",
    },
    {
        q: "Bisakah dipakai di smartphone?",
        a: "Ya! Tampilan responsif untuk semua ukuran layar, dengan bottom navigation bar khusus mobile menggunakan shadcn/ui.",
    },
    {
        q: "Bagaimana cara memulai?",
        a: "Cara tercepat: klik 'Mulai Gratis' dan daftar akun — langsung bisa dipakai. Mau self-host? Baca panduan di halaman Dokumentasi untuk setup Docker + PostgreSQL + Ollama di mesinmu.",
    },
]

export function FaqSection() {
    const { ref, visible } = useReveal()

    return (
        <section id="faq" ref={ref} className={`py-24 px-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="text-center mb-16 space-y-3">
                <Badge variant="outline" className="text-amber border-amber/30 rounded-full">✦ FAQ</Badge>
                <h2 className="font-serif text-4xl font-semibold">
                    Pertanyaan yang <em className="italic text-amber">Sering Ditanyakan</em>
                </h2>
            </div>

            <Accordion type="single" collapsible className="max-w-2xl mx-auto space-y-2">
                {faqs.map(({ q, a }) => (
                    <AccordionItem
                        key={q}
                        value={q}
                        className="border border-border rounded-xl px-6 bg-card data-[state=open]:border-amber/30 data-[state=open]:bg-amber/[0.02]"
                    >
                        <AccordionTrigger className="font-medium text-left hover:no-underline py-5">
                            {q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                            {a}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </section>
    )
}
