import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { CodeBlock } from "@/components/docs/CodeBlock"
import { AlertBlock } from "@/components/docs/AlertBlock"
import { ChevronRight, Package } from "lucide-react"

export default function DockerPage() {
    return (
        <article className="max-w-3xl">
            <div className="mb-10 pb-8 border-b border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Link href="/docs" className="hover:text-foreground transition-colors">Dokumentasi</Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-foreground">Docker Compose</span>
                </div>
                <h1 className="font-serif text-4xl font-semibold mb-3">Docker Compose</h1>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                    StudyNotes menggunakan Docker Compose untuk menjalankan semua infrastruktur:
                    PostgreSQL, MinIO, dan Ollama. Halaman ini menjelaskan konfigurasi dan pengelolaan container.
                </p>
                <Badge variant="outline" className="mt-4 border-indigo-500/30 text-indigo-400">
                    <Package className="h-3 w-3 mr-1" /> Docker
                </Badge>
            </div>

            {/* Services */}
            <section className="mb-12">
                <h2 className="font-serif text-2xl font-semibold mb-4">Services</h2>
                <div className="space-y-3">
                    {[
                        { name: "postgres", image: "postgres:16-alpine", port: "5432", desc: "Database utama. Data persisten via Docker volume." },
                        { name: "minio", image: "minio/minio:latest", port: "9000 / 9001", desc: "Object storage (S3-compatible) untuk upload gambar. Port 9001 adalah console web." },
                        { name: "ollama", image: "ollama/ollama:latest", port: "11434", desc: "AI engine lokal untuk fitur ringkasan. Opsional — bisa dimatikan." },
                    ].map(({ name, image, port, desc }) => (
                        <div key={name} className="p-4 rounded-xl border border-border bg-card">
                            <div className="flex items-center gap-2 mb-1">
                                <code className="text-amber text-sm font-mono font-semibold">{name}</code>
                                <Badge variant="outline" className="text-[10px] border-border">{image}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{desc}</p>
                            <p className="text-xs text-muted-foreground mt-1">Port: <code className="text-foreground/70">{port}</code></p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Perintah */}
            <section className="mb-12">
                <h2 className="font-serif text-2xl font-semibold mb-4">Perintah Utama</h2>
                <CodeBlock filename="terminal" code={`# Jalankan semua service di background
docker compose up -d

# Lihat status semua container
docker compose ps

# Lihat log semua service (real-time)
docker compose logs -f

# Lihat log satu service
docker compose logs postgres
docker compose logs minio
docker compose logs ollama

# Restart semua service
docker compose restart

# Stop semua (data tetap aman di volume)
docker compose stop

# Stop + hapus container (volume tetap)
docker compose down

# Stop + hapus SEMUA termasuk volume (DATA HILANG!)
docker compose down -v`} />
                <AlertBlock type="danger">
                    <code className="text-rose-400">docker compose down -v</code> akan menghapus semua data termasuk database dan file upload. Gunakan hanya jika ingin reset total.
                </AlertBlock>
            </section>

            {/* Volume */}
            <section className="mb-12">
                <h2 className="font-serif text-2xl font-semibold mb-4">Volume & Persistensi Data</h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    Docker Compose menggunakan named volumes agar data tetap tersimpan meskipun container dihapus dan dibuat ulang.
                </p>
                <div className="space-y-2">
                    {[
                        { vol: "postgres-data", desc: "Database PostgreSQL — semua catatan, akun, dan mata kuliah" },
                        { vol: "minio-data", desc: "File upload — gambar dan lampiran" },
                        { vol: "ollama-data", desc: "Model AI yang sudah didownload" },
                    ].map(({ vol, desc }) => (
                        <div key={vol} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
                            <code className="text-amber text-xs font-mono shrink-0 mt-0.5">{vol}</code>
                            <p className="text-sm text-muted-foreground">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Troubleshooting */}
            <section className="mb-8">
                <h2 className="font-serif text-2xl font-semibold mb-4">Troubleshooting</h2>
                <AlertBlock type="warning">
                    Jika container terus restart, cek log dengan <code className="text-amber">docker compose logs [service]</code>. Penyebab umum: password salah di .env atau port sudah dipakai.
                </AlertBlock>
                <CodeBlock filename="terminal" code={`# Cek port yang sedang dipakai
sudo lsof -i :5432
sudo lsof -i :9000

# Rebuild container (setelah ubah docker-compose.yml)
docker compose up -d --build

# Cek disk space (Ollama model butuh ~2-4 GB)
df -h`} />
            </section>
        </article>
    )
}
