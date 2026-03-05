import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CodeBlock } from "@/components/docs/CodeBlock"
import { AlertBlock } from "@/components/docs/AlertBlock"
import { ChevronRight, Database } from "lucide-react"

export default function DatabasePage() {
    return (
        <article className="max-w-3xl">
            <div className="mb-10 pb-8 border-b border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Link href="/docs" className="hover:text-foreground transition-colors">Dokumentasi</Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-foreground">Database</span>
                </div>
                <h1 className="font-serif text-4xl font-semibold mb-3">Database (PostgreSQL)</h1>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                    StudyNotes menggunakan PostgreSQL sebagai database utama, diakses melalui Prisma ORM.
                    Halaman ini menjelaskan skema, migrasi, dan tips pengelolaan database.
                </p>
                <Badge variant="outline" className="mt-4 border-indigo-500/30 text-indigo-400">
                    <Database className="h-3 w-3 mr-1" /> PostgreSQL + Prisma
                </Badge>
            </div>

            {/* Arsitektur */}
            <section className="mb-12">
                <h2 className="font-serif text-2xl font-semibold mb-4">Arsitektur</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    {[
                        { label: "Database", value: "PostgreSQL 16" },
                        { label: "ORM", value: "Prisma v6" },
                        { label: "Search", value: "TSVector FTS" },
                    ].map(({ label, value }) => (
                        <Card key={label} className="border-border bg-card p-4 text-center">
                            <p className="text-xs text-muted-foreground">{label}</p>
                            <p className="font-medium text-amber text-sm mt-1">{value}</p>
                        </Card>
                    ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                    PostgreSQL dijalankan via Docker Compose. Prisma ORM mengelola skema, migrasi,
                    dan query. Full-Text Search menggunakan TSVector untuk pencarian instan.
                </p>
            </section>

            {/* Skema */}
            <section className="mb-12">
                <h2 className="font-serif text-2xl font-semibold mb-4">Model Database</h2>
                <div className="space-y-3">
                    {[
                        { model: "User", desc: "Akun pengguna — dikelola oleh Better Auth", fields: "id, name, email, emailVerified, image, createdAt, updatedAt" },
                        { model: "Session", desc: "Sesi login aktif", fields: "id, expiresAt, token, ipAddress, userAgent, userId" },
                        { model: "Account", desc: "Provider autentikasi (email/password)", fields: "id, accountId, providerId, userId, password" },
                        { model: "Subject", desc: "Mata kuliah / folder", fields: "id, name, color, emoji, userId, createdAt" },
                        { model: "Note", desc: "Catatan pengguna", fields: "id, title, content, isPinned, tags[], subjectId, userId, deletedAt, createdAt, updatedAt" },
                    ].map(({ model, desc, fields }) => (
                        <div key={model} className="p-4 rounded-xl border border-border bg-card">
                            <div className="flex items-center gap-2 mb-1">
                                <code className="text-amber text-sm font-mono font-semibold">{model}</code>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{desc}</p>
                            <p className="text-xs text-muted-foreground">
                                Fields: <code className="text-foreground/70">{fields}</code>
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Perintah */}
            <section className="mb-12">
                <h2 className="font-serif text-2xl font-semibold mb-4">Perintah Prisma</h2>
                <CodeBlock filename="terminal" code={`# Generate Prisma Client (setelah ubah schema)
npx prisma generate

# Terapkan migrasi ke database
npx prisma migrate deploy

# Buat migrasi baru (development)
npx prisma migrate dev --name nama_migrasi

# Buka GUI database
npx prisma studio

# Reset database (HAPUS SEMUA DATA)
npx prisma migrate reset`} />

                <AlertBlock type="danger">
                    <code className="text-rose-400">prisma migrate reset</code> akan menghapus semua data. Hanya gunakan di environment development!
                </AlertBlock>
            </section>

            {/* Full-Text Search */}
            <section className="mb-12">
                <h2 className="font-serif text-2xl font-semibold mb-4">Full-Text Search</h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    StudyNotes menggunakan PostgreSQL TSVector untuk pencarian instan.
                    Kolom <code className="text-amber">search_vector</code> di tabel Note diisi otomatis
                    dari judul dan isi catatan, memungkinkan pencarian bahasa natural yang cepat.
                </p>
                <AlertBlock type="info">
                    TSVector mendukung stemming dan ranking — hasil pencarian diurutkan berdasarkan relevansi.
                </AlertBlock>
            </section>

            {/* Backup */}
            <section className="mb-8">
                <h2 className="font-serif text-2xl font-semibold mb-4">Backup & Restore</h2>
                <CodeBlock filename="terminal" code={`# Backup database
docker exec studynotes-postgres-1 pg_dump -U studynotes studynotes_db > backup.sql

# Restore dari backup
cat backup.sql | docker exec -i studynotes-postgres-1 psql -U studynotes studynotes_db`} />
                <AlertBlock type="tip">
                    Jadwalkan backup harian dengan cron job untuk keamanan data.
                </AlertBlock>
            </section>
        </article>
    )
}
