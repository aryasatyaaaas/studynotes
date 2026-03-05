"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CodeBlock } from "@/components/docs/CodeBlock"
import { AlertBlock } from "@/components/docs/AlertBlock"
import { StepBlock } from "@/components/docs/StepBlock"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    ChevronRight, Clock, Server, Cpu, Bot, CheckCircle2, Star,
    Globe, Settings, HelpCircle, AlertTriangle, ArrowRight,
} from "lucide-react"

const troubleshootingItems = [
    {
        q: "docker compose up gagal — 'port already in use'",
        a: "Port 5432 atau 9000 sudah dipakai proses lain. Cek dengan sudo lsof -i :5432. Stop PostgreSQL lokal dengan sudo systemctl stop postgresql, atau ubah port di docker-compose.yml.",
    },
    {
        q: "npx prisma migrate deploy gagal — 'connection refused'",
        a: "Docker Compose belum berjalan atau PostgreSQL belum selesai start. Tunggu 10-15 detik setelah docker compose up -d, lalu coba lagi. Cek status dengan docker compose ps.",
    },
    {
        q: "Gambar tidak muncul setelah diupload",
        a: "MinIO mungkin belum membuat bucket. Cek log MinIO dengan docker compose logs minio. Pastikan variabel MINIO_BUCKET di .env sama dengan yang ada di MinIO.",
    },
    {
        q: "Tombol AI Summary tidak bereaksi atau error",
        a: "Ollama mungkin belum download model. Jalankan docker exec studynotes-ollama-1 ollama list untuk cek model. Jika kosong, download dengan docker exec studynotes-ollama-1 ollama pull llama3.2.",
    },
    {
        q: "Aplikasi sangat lambat",
        a: "Kemungkinan RAM tidak cukup, terutama jika Ollama berjalan. Cek penggunaan RAM dengan free -h. Jika RAM dibawah 4GB, stop Ollama dengan docker compose stop ollama — fitur AI dinonaktifkan, tapi semua fitur lain tetap normal.",
    },
    {
        q: "Tidak bisa login setelah restart",
        a: "Session cookie mungkin expired atau BETTER_AUTH_SECRET berubah. Hapus cookies di browser dan login ulang. Pastikan BETTER_AUTH_SECRET tidak berubah setiap restart.",
    },
]

const verificationChecklist = [
    { check: "Buka http://localhost:3000 — halaman login/register muncul", service: "Next.js" },
    { check: "Buat akun dan login berhasil", service: "Better Auth" },
    { check: "Buat catatan baru, ketik teks — muncul pesan 'Auto-saved'", service: "Tiptap + PostgreSQL" },
    { check: "Upload gambar ke editor (drag & drop) — gambar tampil", service: "MinIO" },
    { check: "Klik tombol 'AI Summary' — teks ringkasan muncul bertahap", service: "Ollama" },
    { check: "Coba pencarian di search bar — hasil muncul instan", service: "PostgreSQL FTS" },
    { check: "Export catatan ke PDF — file terunduh", service: "html2pdf.js" },
]

const usefulCommands = [
    {
        title: "Start / Stop Semua Service",
        commands: [
            { cmd: "docker compose up -d", desc: "Jalankan semua service" },
            { cmd: "docker compose stop", desc: "Stop semua service (data tetap)" },
            { cmd: "docker compose down", desc: "Stop + hapus container (data tetap di volume)" },
            { cmd: "docker compose restart", desc: "Restart semua service" },
        ],
    },
    {
        title: "Monitoring & Logs",
        commands: [
            { cmd: "docker compose ps", desc: "Status semua service" },
            { cmd: "docker compose logs -f", desc: "Lihat semua log real-time" },
            { cmd: "docker compose logs postgres", desc: "Log khusus database" },
            { cmd: "docker compose logs ollama", desc: "Log khusus AI" },
        ],
    },
    {
        title: "Database",
        commands: [
            { cmd: "npx prisma migrate deploy", desc: "Terapkan migrasi baru" },
            { cmd: "npx prisma studio", desc: "Buka Prisma Studio (GUI database)" },
            { cmd: "npx prisma db seed", desc: "Isi data awal (jika ada)" },
        ],
    },
    {
        title: "Update Aplikasi",
        commands: [
            { cmd: "git pull origin main", desc: "Ambil update terbaru" },
            { cmd: "npm install", desc: "Update dependencies" },
            { cmd: "npx prisma migrate deploy", desc: "Terapkan migrasi baru" },
            { cmd: "npm run build && npm start", desc: "Build ulang dan jalankan" },
        ],
    },
]

export default function SelfHostPage() {
    return (
        <article className="max-w-3xl">
            {/* Page header */}
            <div className="mb-10 pb-8 border-b border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Link href="/docs" className="hover:text-foreground transition-colors">Dokumentasi</Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-foreground">Self-Host Guide</span>
                </div>
                <h1 className="font-serif text-4xl font-semibold mb-3">
                    Panduan Self-Host StudyNotes
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                    Jalankan StudyNotes di komputer atau servermu sendiri. Panduan ini akan memandu kamu
                    dari awal hingga aplikasi berjalan di browser — dalam waktu sekitar 10 menit.
                </p>
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> ~10 menit</span>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                        <Server className="h-3 w-3 mr-1" /> Self-Host
                    </Badge>
                </div>
            </div>

            {/* SECTION 1: Kebutuhan Sistem */}
            <section id="requirements" className="mb-12">
                <h2 className="font-serif text-2xl font-semibold mb-6">Kebutuhan Sistem</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <Card className="border-border bg-card p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <Cpu className="h-5 w-5 text-amber" />
                            <h3 className="font-medium">Minimum (Tanpa AI)</h3>
                        </div>
                        <ul className="space-y-1.5 text-sm text-muted-foreground">
                            {["2 vCPU", "4 GB RAM", "20 GB Storage", "Docker 24+", "Node.js 20 LTS"].map(r => (
                                <li key={r} className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> {r}</li>
                            ))}
                        </ul>
                    </Card>

                    <Card className="border-amber/30 bg-amber/5 p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <Bot className="h-5 w-5 text-amber" />
                            <h3 className="font-medium">Rekomendasi (Dengan AI)</h3>
                        </div>
                        <ul className="space-y-1.5 text-sm text-muted-foreground">
                            {["4 vCPU", "8 GB RAM (16 GB ideal)", "40 GB Storage (model ~4 GB)", "GPU NVIDIA opsional"].map(r => (
                                <li key={r} className="flex gap-2"><Star className="h-4 w-4 text-amber shrink-0" /> {r}</li>
                            ))}
                        </ul>
                    </Card>
                </div>

                <AlertBlock type="info">
                    Kamu bisa menjalankan StudyNotes tanpa fitur AI terlebih dahulu, lalu aktifkan Ollama
                    nanti saat sudah siap. Semua fitur lain tetap berfungsi normal.
                </AlertBlock>

                <h3 className="font-medium mb-3 mt-6">Sistem Operasi yang Didukung</h3>
                <div className="flex flex-wrap gap-2">
                    {["Ubuntu 22.04 / 24.04 ✓", "Debian 12 ✓", "macOS 13+ ✓", "Windows 11 + WSL2 ✓", "Arch Linux ✓"].map(os => (
                        <Badge key={os} variant="outline" className="border-border text-sm">{os}</Badge>
                    ))}
                </div>
            </section>

            {/* SECTION 2: Instalasi */}
            <section id="installation" className="mb-12">
                <h2 className="font-serif text-2xl font-semibold mb-2">Instalasi</h2>
                <p className="text-muted-foreground mb-8">Ikuti langkah-langkah berikut secara berurutan.</p>

                {/* Step 1 */}
                <StepBlock number={1} title="Install Docker & Docker Compose">
                    <p>Docker menjalankan database, storage, dan AI lokal dalam container terisolasi.</p>
                    <AlertBlock type="tip">Jika Docker sudah terinstall, lewati ke langkah 2. Cek dengan <code className="text-amber">docker --version</code>.</AlertBlock>

                    <p className="font-medium text-foreground mt-3">Ubuntu / Debian:</p>
                    <CodeBlock filename="terminal" code={`# Update & install dependencies
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl gnupg

# Add Docker repository & install
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Run Docker without sudo
sudo usermod -aG docker $USER`} />

                    <p className="font-medium text-foreground mt-3">macOS:</p>
                    <CodeBlock code={`brew install --cask docker`} />

                    <p className="font-medium text-foreground mt-3">Verifikasi:</p>
                    <CodeBlock code={`docker --version        # Docker version 25.x.x
docker compose version  # Docker Compose version v2.x.x`} />
                </StepBlock>

                {/* Step 2 */}
                <StepBlock number={2} title="Install Node.js 20 LTS">
                    <p>Next.js 16 membutuhkan Node.js versi 20 ke atas.</p>
                    <CodeBlock filename="terminal" code={`# Install NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc

# Install Node.js 20 LTS
nvm install 20
nvm use 20
nvm alias default 20

# Verifikasi
node --version   # v20.x.x
npm --version    # 10.x.x`} />
                </StepBlock>

                {/* Step 3 */}
                <StepBlock number={3} title="Clone Repository StudyNotes">
                    <p>Unduh source code dari GitHub ke komputermu.</p>
                    <CodeBlock filename="terminal" code={`git clone https://github.com/aryasatyaaaas/studynotes.git
cd studynotes`} />
                    <AlertBlock type="info">
                        Belum punya Git? Install dulu: <code className="text-amber">sudo apt install git</code> (Ubuntu) atau <code className="text-amber">brew install git</code> (macOS).
                    </AlertBlock>
                </StepBlock>

                {/* Step 4 */}
                <StepBlock number={4} title="Konfigurasi File .env">
                    <p>File <code className="text-amber">.env</code> berisi semua konfigurasi aplikasi.</p>
                    <CodeBlock filename="terminal" code={`cp .env.example .env
nano .env   # atau: code .env`} />

                    <p className="font-medium text-foreground mt-4">Variabel yang wajib diubah:</p>
                    <div className="overflow-x-auto my-4">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-2 pr-4 font-medium text-foreground">Variabel</th>
                                    <th className="text-left py-2 font-medium text-foreground">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody className="text-muted-foreground">
                                <tr className="border-b border-border/50">
                                    <td className="py-2 pr-4 font-mono text-amber text-xs">POSTGRES_PASSWORD</td>
                                    <td className="py-2">Wajib diganti! Gunakan password kuat.</td>
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="py-2 pr-4 font-mono text-amber text-xs">BETTER_AUTH_SECRET</td>
                                    <td className="py-2">Generate random 32 karakter.</td>
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="py-2 pr-4 font-mono text-amber text-xs">MINIO_SECRET_KEY</td>
                                    <td className="py-2">Wajib diganti! Password MinIO storage.</td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-4 font-mono text-amber text-xs">NEXT_PUBLIC_APP_URL</td>
                                    <td className="py-2">Biarkan jika akses lokal saja.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <AlertBlock type="tip">
                        Generate secret key yang kuat:
                        <CodeBlock code={`openssl rand -base64 32   # untuk BETTER_AUTH_SECRET
openssl rand -hex 16      # untuk password lainnya`} />
                    </AlertBlock>

                    <p className="font-medium text-foreground mt-4">Contoh .env:</p>
                    <CodeBlock filename=".env" code={`DEPLOYMENT_MODE=selfhost
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://studynotes:PASSWORD_KUAT@127.0.0.1:5432/studynotes_db
POSTGRES_USER=studynotes
POSTGRES_PASSWORD=PASSWORD_KUAT
POSTGRES_DB=studynotes_db

# Auth
BETTER_AUTH_SECRET=PASTE_HASIL_OPENSSL
BETTER_AUTH_URL=http://localhost:3000

# AI (Ollama)
AI_PROVIDER=ollama
AI_MODEL=llama3.2
AI_BASE_URL=http://localhost:11434

# MinIO Storage
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=GANTI_SECRET_INI
MINIO_BUCKET=studynotes-uploads

# Cron
CRON_SECRET=RANDOM_STRING`} />
                </StepBlock>

                {/* Step 5 */}
                <StepBlock number={5} title="Jalankan Infrastruktur dengan Docker">
                    <p>Perintah ini menjalankan PostgreSQL, MinIO, dan Ollama sekaligus.</p>
                    <CodeBlock filename="terminal" code={`docker compose up -d
docker compose ps`} />

                    <p className="mt-3">Output yang diharapkan:</p>
                    <CodeBlock code={`NAME                    STATUS          PORTS
studynotes-postgres-1   Up (healthy)    0.0.0.0:5432->5432/tcp
studynotes-minio-1      Up (healthy)    0.0.0.0:9000->9000/tcp
studynotes-ollama-1     Up              0.0.0.0:11434->11434/tcp`} />

                    <AlertBlock type="warning">
                        Jika ada service yang &quot;Exit&quot; atau &quot;Restarting&quot;, jalankan <code className="text-amber">docker compose logs [nama-service]</code> untuk melihat error.
                    </AlertBlock>
                </StepBlock>

                {/* Step 6 */}
                <StepBlock number={6} title="Download Model AI Ollama (Opsional)">
                    <p>Mengunduh model <code className="text-amber">llama3.2</code> (~2 GB) untuk fitur ringkasan AI.</p>
                    <AlertBlock type="info">
                        Langkah ini bisa dilewati jika tidak ingin menggunakan fitur AI.
                    </AlertBlock>
                    <CodeBlock filename="terminal" code={`docker exec studynotes-ollama-1 ollama pull llama3.2

# Verifikasi
docker exec studynotes-ollama-1 ollama list`} />

                    <AlertBlock type="tip">
                        Model lebih ringan (1.1 GB, cocok untuk RAM 4 GB):
                        <CodeBlock code={`docker exec studynotes-ollama-1 ollama pull llama3.2:1b`} />
                        Ganti <code className="text-amber">AI_MODEL=llama3.2:1b</code> di .env.
                    </AlertBlock>
                </StepBlock>

                {/* Step 7 */}
                <StepBlock number={7} title="Install Dependencies & Siapkan Database">
                    <CodeBlock filename="terminal" code={`npm install
npx prisma generate
npx prisma migrate deploy
# Output: "All migrations have been successfully applied"`} />
                    <AlertBlock type="warning">
                        Pastikan Docker Compose sudah berjalan (Step 5) sebelum migrasi database.
                    </AlertBlock>
                </StepBlock>

                {/* Step 8 */}
                <StepBlock number={8} title="Jalankan StudyNotes">
                    <CodeBlock filename="terminal" code={`# Mode development (hot reload)
npm run dev

# Mode production (lebih cepat)
npm run build && npm start`} />

                    <p className="mt-3">Buka browser dan akses:</p>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border my-3">
                        <Globe className="h-5 w-5 text-amber shrink-0" />
                        <code className="text-amber text-lg font-mono font-bold">http://localhost:3000</code>
                    </div>

                    <AlertBlock type="tip">
                        Pertama kali, kamu akan diarahkan ke halaman registrasi. Buat akun pertamamu.
                        Setelah itu, set <code className="text-amber">AUTH_REGISTRATION_OPEN=false</code> di .env untuk mencegah orang lain mendaftar.
                    </AlertBlock>
                </StepBlock>
            </section>

            {/* SECTION 3: Verifikasi */}
            <section id="verification" className="mb-12">
                <h2 className="font-serif text-2xl font-semibold mb-6">Verifikasi Instalasi</h2>
                <p className="text-muted-foreground mb-6">Checklist untuk memastikan semua komponen berjalan:</p>

                <div className="space-y-3">
                    {verificationChecklist.map(({ check, service }, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card group hover:border-emerald-500/30 transition-colors">
                            <div className="w-6 h-6 rounded-full border-2 border-border group-hover:border-emerald-500 flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-foreground">{check}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Komponen: {service}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* SECTION 4: Perintah Berguna */}
            <section id="commands" className="mb-12">
                <h2 className="font-serif text-2xl font-semibold mb-6">Perintah yang Berguna</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {usefulCommands.map(({ title, commands }) => (
                        <Card key={title} className="border-border bg-card p-5">
                            <h3 className="font-medium mb-3 text-foreground">{title}</h3>
                            <div className="space-y-2">
                                {commands.map(({ cmd, desc }) => (
                                    <div key={cmd}>
                                        <code className="text-xs bg-muted text-amber px-2 py-0.5 rounded block font-mono mb-0.5">{cmd}</code>
                                        <p className="text-xs text-muted-foreground">{desc}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            {/* SECTION 5: Troubleshooting */}
            <section id="troubleshooting" className="mb-12">
                <h2 className="font-serif text-2xl font-semibold mb-6">Troubleshooting</h2>

                <Accordion type="single" collapsible className="space-y-2">
                    {troubleshootingItems.map(({ q, a }) => (
                        <AccordionItem key={q} value={q} className="border border-border rounded-xl px-6 bg-card data-[state=open]:border-amber/30">
                            <AccordionTrigger className="font-medium text-left hover:no-underline py-4 gap-3">
                                <AlertTriangle className="h-4 w-4 text-amber shrink-0" />
                                {q}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                                {a}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>

            {/* SECTION 6: Langkah Selanjutnya */}
            <section id="next-steps" className="mb-8">
                <h2 className="font-serif text-2xl font-semibold mb-6">Langkah Selanjutnya</h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { icon: Globe, title: "Deploy ke VPS", desc: "Akses dari mana saja dengan VPS Ubuntu + Nginx + SSL.", href: "/docs/vps", color: "text-indigo-400" },
                        { icon: Settings, title: "Konfigurasi Lanjutan", desc: "Pelajari semua environment variable dan opsi konfigurasi.", href: "/docs/env-vars", color: "text-amber" },
                        { icon: HelpCircle, title: "FAQ", desc: "Pertanyaan umum seputar self-hosting dan keamanan.", href: "/docs/faq", color: "text-emerald-400" },
                    ].map(({ icon: Icon, title, desc, href, color }) => (
                        <Link key={title} href={href}>
                            <Card className="border-border bg-card p-5 h-full hover:border-amber/30 hover:-translate-y-1 transition-all group cursor-pointer">
                                <Icon className={`h-6 w-6 ${color} mb-3`} />
                                <h3 className="font-medium mb-1.5 group-hover:text-amber transition-colors">{title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                                <div className={`flex items-center gap-1 text-xs ${color} mt-3`}>
                                    Baca selengkapnya <ArrowRight className="h-3 w-3" />
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>
        </article>
    )
}
