"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { CodeBlock } from "@/components/docs/CodeBlock"
import { AlertBlock } from "@/components/docs/AlertBlock"
import { ChevronRight, Settings } from "lucide-react"

const envGroups = [
    {
        title: "Umum",
        vars: [
            { name: "DEPLOYMENT_MODE", default: "selfhost", required: false, desc: "Mode deployment: 'selfhost' atau 'cloud'." },
            { name: "NODE_ENV", default: "development", required: false, desc: "'development' untuk hot reload, 'production' untuk performa optimal." },
            { name: "NEXT_PUBLIC_APP_URL", default: "http://localhost:3000", required: true, desc: "URL publik aplikasi. Ganti jika deploy ke domain custom." },
            { name: "NEXT_PUBLIC_APP_NAME", default: "StudyNotes", required: false, desc: "Nama aplikasi yang ditampilkan di UI." },
        ],
    },
    {
        title: "Database (PostgreSQL)",
        vars: [
            { name: "DATABASE_URL", default: "postgresql://user:pass@localhost:5432/db", required: true, desc: "Connection string PostgreSQL. Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE" },
            { name: "POSTGRES_USER", default: "studynotes", required: true, desc: "Username PostgreSQL. Harus sama dengan yang ada di DATABASE_URL." },
            { name: "POSTGRES_PASSWORD", default: "—", required: true, desc: "Password PostgreSQL. Wajib diganti dari default! Gunakan password kuat." },
            { name: "POSTGRES_DB", default: "studynotes_db", required: true, desc: "Nama database. Dibuat otomatis oleh Docker Compose." },
        ],
    },
    {
        title: "Autentikasi (Better Auth)",
        vars: [
            { name: "BETTER_AUTH_SECRET", default: "—", required: true, desc: "Secret key untuk signing session. Generate dengan: openssl rand -base64 32" },
            { name: "BETTER_AUTH_URL", default: "http://localhost:3000", required: true, desc: "URL base untuk callback autentikasi. Harus sama dengan NEXT_PUBLIC_APP_URL." },
            { name: "AUTH_REGISTRATION_OPEN", default: "true", required: false, desc: "Set 'false' untuk menutup registrasi publik setelah membuat akun pertama." },
            { name: "AUTH_EMAIL_VERIFICATION", default: "false", required: false, desc: "Aktifkan verifikasi email saat registrasi." },
        ],
    },
    {
        title: "AI (Ollama)",
        vars: [
            { name: "AI_PROVIDER", default: "ollama", required: false, desc: "Provider AI yang digunakan. Saat ini hanya mendukung 'ollama'." },
            { name: "AI_MODEL", default: "llama3.2", required: false, desc: "Model Ollama untuk ringkasan. Alternatif ringan: 'llama3.2:1b'." },
            { name: "AI_BASE_URL", default: "http://localhost:11434", required: false, desc: "URL endpoint Ollama. Default jika dijalankan via Docker Compose." },
        ],
    },
    {
        title: "Storage (MinIO)",
        vars: [
            { name: "MINIO_ENDPOINT", default: "localhost", required: true, desc: "Hostname MinIO server." },
            { name: "MINIO_PORT", default: "9000", required: false, desc: "Port MinIO API." },
            { name: "MINIO_ACCESS_KEY", default: "minioadmin", required: true, desc: "Access key MinIO." },
            { name: "MINIO_SECRET_KEY", default: "minioadmin", required: true, desc: "Secret key MinIO. Wajib diganti dari default!" },
            { name: "MINIO_BUCKET", default: "studynotes-uploads", required: false, desc: "Nama bucket untuk menyimpan file upload." },
            { name: "STORAGE_PUBLIC_URL", default: "http://localhost:9000", required: false, desc: "URL publik untuk mengakses file yang diupload." },
        ],
    },
    {
        title: "Cron & Lainnya",
        vars: [
            { name: "CRON_SECRET", default: "—", required: false, desc: "Secret untuk mengautentikasi cron job endpoint (cleanup soft-deleted notes)." },
        ],
    },
]

export default function EnvVarsPage() {
    return (
        <article className="max-w-3xl">
            <div className="mb-10 pb-8 border-b border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Link href="/docs" className="hover:text-foreground transition-colors">Dokumentasi</Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-foreground">Environment Variables</span>
                </div>
                <h1 className="font-serif text-4xl font-semibold mb-3">Environment Variables</h1>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                    Referensi lengkap semua variabel environment yang digunakan StudyNotes.
                    Konfigurasi ini tersimpan di file <code className="text-amber">.env</code> di root project.
                </p>
                <Badge variant="outline" className="mt-4 border-amber/30 text-amber">
                    <Settings className="h-3 w-3 mr-1" /> Konfigurasi
                </Badge>
            </div>

            <AlertBlock type="warning">
                Jangan pernah commit file <code className="text-amber">.env</code> ke Git! Pastikan file ini ada di <code className="text-amber">.gitignore</code>.
            </AlertBlock>

            <AlertBlock type="tip">
                Salin template konfigurasi untuk memulai:
                <CodeBlock code="cp .env.example .env" />
            </AlertBlock>

            {envGroups.map((group) => (
                <section key={group.title} id={group.title.toLowerCase().replace(/[^a-z]/g, "-")} className="mb-12">
                    <h2 className="font-serif text-2xl font-semibold mb-4">{group.title}</h2>
                    <div className="space-y-3">
                        {group.vars.map((v) => (
                            <div key={v.name} className="p-4 rounded-xl border border-border bg-card">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <code className="text-amber text-sm font-mono font-semibold">{v.name}</code>
                                    {v.required && <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 text-[10px]">Wajib</Badge>}
                                </div>
                                <p className="text-sm text-muted-foreground mb-1">{v.desc}</p>
                                <p className="text-xs text-muted-foreground">
                                    Default: <code className="text-foreground/70">{v.default}</code>
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            ))}

            <section className="mb-8">
                <h2 className="font-serif text-2xl font-semibold mb-4">Contoh .env Lengkap</h2>
                <CodeBlock filename=".env" code={`DEPLOYMENT_MODE=selfhost
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=StudyNotes

# Database
DATABASE_URL=postgresql://studynotes:PASSWORD_KUAT@127.0.0.1:5432/studynotes_db
POSTGRES_USER=studynotes
POSTGRES_PASSWORD=PASSWORD_KUAT
POSTGRES_DB=studynotes_db

# Auth
BETTER_AUTH_SECRET=GENERATE_DENGAN_OPENSSL
BETTER_AUTH_URL=http://localhost:3000
AUTH_REGISTRATION_OPEN=true
AUTH_EMAIL_VERIFICATION=false

# AI
AI_PROVIDER=ollama
AI_MODEL=llama3.2
AI_BASE_URL=http://localhost:11434

# Storage
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=GANTI_SECRET_INI
MINIO_BUCKET=studynotes-uploads
STORAGE_PUBLIC_URL=http://localhost:9000

# Cron
CRON_SECRET=RANDOM_STRING`} />
            </section>
        </article>
    )
}
