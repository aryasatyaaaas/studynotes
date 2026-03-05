import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { CodeBlock } from "@/components/docs/CodeBlock"
import { AlertBlock } from "@/components/docs/AlertBlock"
import { StepBlock } from "@/components/docs/StepBlock"
import { ChevronRight, Globe, Clock } from "lucide-react"

export default function VpsPage() {
    return (
        <article className="max-w-3xl">
            <div className="mb-10 pb-8 border-b border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Link href="/docs" className="hover:text-foreground transition-colors">Dokumentasi</Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-foreground">VPS Ubuntu</span>
                </div>
                <h1 className="font-serif text-4xl font-semibold mb-3">Deploy ke VPS Ubuntu</h1>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                    Panduan lengkap deploy StudyNotes ke VPS Ubuntu agar bisa diakses dari mana saja
                    melalui domain custom dengan HTTPS.
                </p>
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> ~20 menit</span>
                    <Badge variant="outline" className="border-indigo-500/30 text-indigo-400">
                        <Globe className="h-3 w-3 mr-1" /> Deployment
                    </Badge>
                </div>
            </div>

            <AlertBlock type="info">
                Panduan ini mengasumsikan kamu sudah berhasil menjalankan StudyNotes secara lokal (lihat <Link href="/docs/self-host" className="text-amber hover:underline">Self-Host Guide</Link>).
            </AlertBlock>

            <section className="mb-12">
                <h2 className="font-serif text-2xl font-semibold mb-2">Prasyarat</h2>
                <ul className="space-y-1.5 text-sm text-muted-foreground list-disc list-inside">
                    <li>VPS dengan Ubuntu 22.04 / 24.04 (min 2 vCPU, 4 GB RAM)</li>
                    <li>Domain yang sudah diarahkan ke IP VPS (A record)</li>
                    <li>Akses SSH ke VPS</li>
                </ul>
            </section>

            <section className="mb-12">
                <StepBlock number={1} title="SSH ke VPS & Update Sistem">
                    <CodeBlock filename="terminal" code={`ssh root@IP_VPS_KAMU

# Update system
apt update && apt upgrade -y

# Install essentials
apt install -y git curl ufw`} />
                </StepBlock>

                <StepBlock number={2} title="Install Docker">
                    <CodeBlock filename="terminal" code={`curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker`} />
                </StepBlock>

                <StepBlock number={3} title="Install Node.js 20">
                    <CodeBlock filename="terminal" code={`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm alias default 20`} />
                </StepBlock>

                <StepBlock number={4} title="Clone & Setup StudyNotes">
                    <CodeBlock filename="terminal" code={`git clone https://github.com/aryasatyaaaas/studynotes.git
cd studynotes
cp .env.example .env
nano .env`} />
                    <AlertBlock type="warning">
                        Ubah <code className="text-amber">NEXT_PUBLIC_APP_URL</code> ke <code className="text-amber">https://domain-kamu.com</code> dan
                        ubah <code className="text-amber">BETTER_AUTH_URL</code> ke URL yang sama. Pastikan semua password sudah diganti!
                    </AlertBlock>
                </StepBlock>

                <StepBlock number={5} title="Jalankan Infrastruktur">
                    <CodeBlock filename="terminal" code={`docker compose up -d
npm install
npx prisma generate
npx prisma migrate deploy`} />
                </StepBlock>

                <StepBlock number={6} title="Build & Jalankan Production">
                    <CodeBlock filename="terminal" code={`npm run build
npm start`} />
                    <AlertBlock type="tip">
                        Gunakan <code className="text-amber">pm2</code> agar aplikasi tetap berjalan setelah terminal ditutup:
                        <CodeBlock code={`npm install -g pm2
pm2 start npm --name "studynotes" -- start
pm2 save
pm2 startup`} />
                    </AlertBlock>
                </StepBlock>

                <StepBlock number={7} title="Setup Firewall">
                    <CodeBlock filename="terminal" code={`ufw allow 22     # SSH
ufw allow 80     # HTTP
ufw allow 443    # HTTPS
ufw enable`} />
                </StepBlock>
            </section>

            <section className="mb-8 p-5 rounded-xl border border-amber/20 bg-amber/5">
                <h2 className="font-serif text-lg font-semibold mb-2">Langkah Selanjutnya</h2>
                <p className="text-sm text-muted-foreground">
                    Setup <Link href="/docs/nginx" className="text-amber hover:underline">Nginx + SSL</Link> untuk
                    mengakses StudyNotes via HTTPS dengan domain custom.
                </p>
            </section>
        </article>
    )
}
