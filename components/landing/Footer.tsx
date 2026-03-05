import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export function Footer() {
    return (
        <footer className="border-t border-border py-12 px-6 bg-muted/10">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 font-serif font-semibold">
                        <span className="w-2 h-2 rounded-full bg-amber" />
                        StudyNotes
                    </div>
                    <p className="text-sm text-muted-foreground">Catatan cerdas bertenaga AI lokal.</p>
                    <p className="text-xs text-muted-foreground">Dibuat dengan ♥ untuk semua orang</p>
                </div>

                <div className="space-y-2">
                    <p className="font-medium text-sm mb-3">Navigasi</p>
                    {[
                        { label: "Fitur", href: "#features" },
                        { label: "Cara Kerja", href: "#cara-kerja" },
                        { label: "FAQ", href: "#faq" },
                        { label: "Masuk", href: "/login" },
                        { label: "Daftar", href: "/register" },
                    ].map(link => (
                        <Link key={link.label} href={link.href} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div>
                    <p className="font-medium text-sm mb-3">Dibangun dengan</p>
                    <div className="flex flex-wrap gap-2">
                        {["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "shadcn/ui", "Tiptap", "PostgreSQL", "Prisma", "Better Auth", "Zod", "MinIO", "Ollama", "Vercel AI SDK", "Zustand", "SWR", "React Hook Form", "use-debounce", "html2pdf.js", "Docker"].map(t => (
                            <Badge key={t} variant="outline" className="text-xs border-border">{t}</Badge>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
                <span>© {new Date().getFullYear()} StudyNotes. Open source.</span>
                <span>Self-hostable. Privasimu sepenuhnya milikmu.</span>
            </div>
        </footer>
    )
}
