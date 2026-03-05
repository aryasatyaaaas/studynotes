import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CodeBlock } from "@/components/docs/CodeBlock"
import { AlertBlock } from "@/components/docs/AlertBlock"
import { ChevronRight, Bot } from "lucide-react"

export default function AiPage() {
    return (
        <article className="max-w-3xl">
            <div className="mb-10 pb-8 border-b border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Link href="/docs" className="hover:text-foreground transition-colors">Dokumentasi</Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-foreground">Ollama AI</span>
                </div>
                <h1 className="font-serif text-4xl font-semibold mb-3">Ollama AI</h1>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                    Fitur ringkasan AI di StudyNotes ditenagai oleh Ollama — platform model AI
                    yang berjalan lokal. Halaman ini menjelaskan cara kerja, konfigurasi, dan troubleshooting.
                </p>
                <Badge variant="outline" className="mt-4 border-emerald-500/30 text-emerald-400">
                    <Bot className="h-3 w-3 mr-1" /> AI Lokal
                </Badge>
            </div>

            {/* Cara Kerja */}
            <section className="mb-12">
                <h2 className="font-serif text-2xl font-semibold mb-4">Cara Kerja</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    {[
                        { step: "1", label: "User klik AI Summary" },
                        { step: "2", label: "API kirim prompt ke Ollama" },
                        { step: "3", label: "Token di-stream ke UI" },
                    ].map(({ step, label }) => (
                        <Card key={step} className="border-border bg-card p-4 text-center">
                            <p className="text-2xl font-serif font-bold text-amber">{step}</p>
                            <p className="text-xs text-muted-foreground mt-1">{label}</p>
                        </Card>
                    ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                    StudyNotes menggunakan <strong className="text-foreground">Vercel AI SDK</strong> untuk streaming.
                    API route <code className="text-amber">/api/summarize</code> menerima teks catatan,
                    mengirim prompt ke Ollama, dan men-stream token respons langsung ke browser
                    menggunakan hook <code className="text-amber">useCompletion</code>.
                </p>
            </section>

            {/* Model */}
            <section className="mb-12">
                <h2 className="font-serif text-2xl font-semibold mb-4">Model yang Didukung</h2>
                <div className="space-y-3">
                    {[
                        { name: "llama3.2", size: "~2 GB", ram: "8 GB+", desc: "Rekomendasi. Performa terbaik untuk ringkasan." },
                        { name: "llama3.2:1b", size: "~1.1 GB", ram: "4 GB+", desc: "Lebih ringan, cocok untuk RAM terbatas." },
                        { name: "mistral", size: "~4.1 GB", ram: "16 GB+", desc: "Alternatif kuat, output lebih detail." },
                        { name: "phi3", size: "~2.3 GB", ram: "8 GB+", desc: "Model Microsoft, efisien untuk instruksi." },
                    ].map(({ name, size, ram, desc }) => (
                        <div key={name} className="p-4 rounded-xl border border-border bg-card flex items-start justify-between gap-4">
                            <div>
                                <code className="text-amber text-sm font-mono font-semibold">{name}</code>
                                <p className="text-sm text-muted-foreground mt-1">{desc}</p>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-xs text-muted-foreground">Ukuran: <span className="text-foreground">{size}</span></p>
                                <p className="text-xs text-muted-foreground">RAM: <span className="text-foreground">{ram}</span></p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Install & Ganti Model */}
            <section className="mb-12">
                <h2 className="font-serif text-2xl font-semibold mb-4">Install & Ganti Model</h2>
                <CodeBlock filename="terminal" code={`# Download model default
docker exec studynotes-ollama-1 ollama pull llama3.2

# Download model alternatif
docker exec studynotes-ollama-1 ollama pull llama3.2:1b

# Lihat model yang terinstall
docker exec studynotes-ollama-1 ollama list

# Hapus model yang tidak dipakai
docker exec studynotes-ollama-1 ollama rm nama-model`} />

                <AlertBlock type="tip">
                    Setelah download model baru, ubah variabel <code className="text-amber">AI_MODEL</code> di file .env dan restart aplikasi.
                </AlertBlock>
            </section>

            {/* Konfigurasi */}
            <section className="mb-12">
                <h2 className="font-serif text-2xl font-semibold mb-4">Konfigurasi .env</h2>
                <CodeBlock filename=".env" code={`AI_PROVIDER=ollama
AI_MODEL=llama3.2
AI_BASE_URL=http://localhost:11434`} />
                <AlertBlock type="info">
                    Jika Ollama berjalan di mesin lain (misalnya GPU server), ganti <code className="text-amber">AI_BASE_URL</code> ke alamat IP server tersebut.
                </AlertBlock>
            </section>

            {/* Troubleshooting */}
            <section className="mb-8">
                <h2 className="font-serif text-2xl font-semibold mb-4">Troubleshooting</h2>
                <div className="space-y-3">
                    {[
                        { q: "AI Summary tidak merespons", a: "Pastikan container Ollama berjalan: docker compose ps. Cek log: docker compose logs ollama." },
                        { q: "Respons AI sangat lambat", a: "Model terlalu besar untuk RAM. Coba llama3.2:1b yang lebih ringan. GPU NVIDIA akan mempercepat signifikan." },
                        { q: "Error 'model not found'", a: "Model belum didownload. Jalankan: docker exec studynotes-ollama-1 ollama pull llama3.2" },
                        { q: "Ingin menonaktifkan AI", a: "Stop container: docker compose stop ollama. Fitur AI tombolnya tetap ada tapi tidak akan berfungsi — fitur lain tetap normal." },
                    ].map(({ q, a }) => (
                        <div key={q} className="p-4 rounded-xl border border-border bg-card">
                            <p className="font-medium text-sm mb-1">{q}</p>
                            <p className="text-sm text-muted-foreground">{a}</p>
                        </div>
                    ))}
                </div>
            </section>
        </article>
    )
}
