import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
    Server, BookOpen, PenLine, Bot, FolderOpen, Search,
    FileDown, MonitorSmartphone, ArrowRight, Shield, Zap,
} from "lucide-react"

const features = [
    { icon: PenLine, title: "Editor Rich Text", desc: "Tiptap-powered, auto-save, paste gambar langsung" },
    { icon: Bot, title: "AI Ringkasan Lokal", desc: "Ollama + Vercel AI SDK, streaming real-time" },
    { icon: FolderOpen, title: "Organisasi Mata Kuliah", desc: "Folder dengan warna & emoji unik" },
    { icon: Search, title: "Pencarian Instan", desc: "PostgreSQL Full-Text Search (TSVector)" },
    { icon: FileDown, title: "Export PDF", desc: "html2pdf.js, berjalan di browser" },
    { icon: MonitorSmartphone, title: "Responsif & Tema", desc: "Dark/Light mode, mobile-first" },
]

export default function DocsPage() {
    return (
        <article className="max-w-3xl">
            {/* Header */}
            <div className="mb-10 pb-8 border-b border-border">
                <Badge variant="outline" className="text-amber border-amber/30 rounded-full mb-4">
                    <BookOpen className="h-3 w-3 mr-1" /> Dokumentasi
                </Badge>
                <h1 className="font-serif text-4xl font-semibold mb-3">
                    Selamat Datang di StudyNotes
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                    StudyNotes adalah aplikasi catatan kuliah open source bertenaga AI. Dibangun
                    dengan Next.js 16, PostgreSQL, dan Ollama — tersedia sebagai layanan cloud
                    maupun self-hosted di mesinmu sendiri.
                </p>
            </div>

            {/* Apa itu StudyNotes */}
            <section className="mb-12">
                <h2 className="font-serif text-2xl font-semibold mb-4">Apa itu StudyNotes?</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                    StudyNotes menggabungkan editor rich-text modern, organisasi cerdas per mata kuliah,
                    dan ringkasan AI — semua dalam satu aplikasi. Kamu bisa menulis catatan dengan format
                    lengkap, mengatur per mata kuliah, dan merangkum catatan panjang menjadi poin-poin
                    inti hanya dengan satu klik.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    Proyek ini sepenuhnya open source dan gratis. Kamu bisa langsung mendaftar dan
                    menggunakan layanan cloud kami, atau menjalankan seluruh stack di komputermu
                    sendiri dengan panduan self-host yang tersedia.
                </p>
            </section>

            {/* Dua Mode */}
            <section className="mb-12">
                <h2 className="font-serif text-2xl font-semibold mb-4">Dua Mode Penggunaan</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="border-border bg-card p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <Zap className="h-5 w-5 text-amber" />
                            <h3 className="font-medium">☁️ Mode Cloud</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                            Daftar akun, langsung pakai. Tanpa install, tanpa konfigurasi.
                            Cocok untuk yang ingin langsung produktif.
                        </p>
                        <Link href="/register" className="text-xs text-amber hover:text-amber/80 flex items-center gap-1 transition-colors">
                            Mulai Gratis <ArrowRight className="h-3 w-3" />
                        </Link>
                    </Card>
                    <Card className="border-amber/30 bg-amber/5 p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <Server className="h-5 w-5 text-amber" />
                            <h3 className="font-medium">🖥️ Mode Self-Host</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                            Jalankan di mesinmu sendiri dengan Docker. Kontrol penuh atas data,
                            AI offline via Ollama, dan privasi maksimal.
                        </p>
                        <Link href="/docs/self-host" className="text-xs text-amber hover:text-amber/80 flex items-center gap-1 transition-colors">
                            Baca Panduan Self-Host <ArrowRight className="h-3 w-3" />
                        </Link>
                    </Card>
                </div>
            </section>

            {/* Fitur Utama */}
            <section className="mb-12">
                <h2 className="font-serif text-2xl font-semibold mb-4">Fitur Utama</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {features.map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                            <div className="w-9 h-9 rounded-lg bg-amber/10 flex items-center justify-center shrink-0">
                                <Icon className="h-4 w-4 text-amber" />
                            </div>
                            <div>
                                <p className="font-medium text-sm">{title}</p>
                                <p className="text-xs text-muted-foreground">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Tech Stack */}
            <section className="mb-12">
                <h2 className="font-serif text-2xl font-semibold mb-4">Tech Stack</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-2 pr-4 font-medium text-foreground">Layer</th>
                                <th className="text-left py-2 font-medium text-foreground">Teknologi</th>
                            </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                            {[
                                ["Framework", "Next.js 16 (App Router)"],
                                ["Bahasa", "TypeScript (strict)"],
                                ["UI Library", "React 19"],
                                ["Styling", "Tailwind CSS v4"],
                                ["Komponen", "shadcn/ui + Radix UI"],
                                ["Editor", "Tiptap (ProseMirror)"],
                                ["Database", "PostgreSQL + Prisma ORM"],
                                ["Auth", "Better Auth"],
                                ["Storage", "MinIO (S3-compatible)"],
                                ["AI", "Ollama + Vercel AI SDK"],
                                ["State", "Zustand + SWR"],
                                ["Validasi", "Zod + React Hook Form"],
                                ["Container", "Docker + Docker Compose"],
                            ].map(([layer, tech]) => (
                                <tr key={layer} className="border-b border-border/50">
                                    <td className="py-2 pr-4 font-mono text-amber text-xs">{layer}</td>
                                    <td className="py-2">{tech}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Keamanan */}
            <section className="mb-12">
                <h2 className="font-serif text-2xl font-semibold mb-4">Keamanan</h2>
                <div className="space-y-2 text-sm text-muted-foreground">
                    {[
                        "Autentikasi via Better Auth dengan session httpOnly cookie",
                        "Rate limiting pada endpoint login dan API",
                        "Validasi input dengan Zod di semua API route",
                        "Soft delete untuk catatan (recoverable)",
                        "Semua password di-hash secara otomatis",
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-emerald-400 shrink-0" />
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Mulai */}
            <section className="mb-8 p-6 rounded-xl border border-amber/20 bg-amber/5">
                <h2 className="font-serif text-xl font-semibold mb-2">Siap Mulai?</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    Pilih cara yang paling cocok untukmu:
                </p>
                <div className="flex gap-3 flex-wrap">
                    <Link href="/register" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber text-amber-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                        Daftar & Langsung Pakai →
                    </Link>
                    <Link href="/docs/self-host" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:border-amber/40 transition-colors">
                        <Server className="h-4 w-4" /> Panduan Self-Host
                    </Link>
                </div>
            </section>
        </article>
    )
}
