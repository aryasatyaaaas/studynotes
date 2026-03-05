import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, GitCommit } from "lucide-react"

const changelog = [
    {
        version: "1.0.0",
        date: "Maret 2026",
        label: "Initial Release",
        changes: [
            "Landing page dengan 12 section",
            "Editor rich-text Tiptap dengan auto-save",
            "Organisasi catatan per mata kuliah",
            "AI ringkasan via Ollama + Vercel AI SDK",
            "Upload gambar ke MinIO (S3-compatible)",
            "Pencarian instan dengan PostgreSQL FTS",
            "Export catatan ke PDF",
            "Autentikasi Better Auth dengan rate limiting",
            "Halaman dokumentasi lengkap",
            "Dukungan mode Cloud & Self-Host",
            "Dark/Light theme",
            "Responsif untuk desktop & mobile",
        ],
    },
]

export default function ChangelogPage() {
    return (
        <article className="max-w-3xl">
            <div className="mb-10 pb-8 border-b border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Link href="/docs" className="hover:text-foreground transition-colors">Dokumentasi</Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-foreground">Changelog</span>
                </div>
                <h1 className="font-serif text-4xl font-semibold mb-3">Changelog</h1>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                    Riwayat perubahan dan update StudyNotes.
                </p>
                <Badge variant="outline" className="mt-4 border-amber/30 text-amber">
                    <GitCommit className="h-3 w-3 mr-1" /> Versi
                </Badge>
            </div>

            {changelog.map((release) => (
                <section key={release.version} className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-amber text-amber-foreground flex items-center justify-center font-serif font-bold text-sm shrink-0">
                            {release.version.split(".")[0]}
                        </div>
                        <div>
                            <h2 className="font-serif text-xl font-semibold">
                                v{release.version} — {release.label}
                            </h2>
                            <p className="text-xs text-muted-foreground">{release.date}</p>
                        </div>
                    </div>
                    <ul className="space-y-2 ml-5">
                        {release.changes.map((change, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="text-amber mt-1">•</span>
                                {change}
                            </li>
                        ))}
                    </ul>
                </section>
            ))}
        </article>
    )
}
