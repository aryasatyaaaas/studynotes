import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { CodeBlock } from "@/components/docs/CodeBlock"
import { AlertBlock } from "@/components/docs/AlertBlock"
import { StepBlock } from "@/components/docs/StepBlock"
import { ChevronRight, ShieldCheck, Clock } from "lucide-react"

export default function NginxPage() {
    return (
        <article className="max-w-3xl">
            <div className="mb-10 pb-8 border-b border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Link href="/docs" className="hover:text-foreground transition-colors">Dokumentasi</Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-foreground">Nginx + SSL</span>
                </div>
                <h1 className="font-serif text-4xl font-semibold mb-3">Nginx + SSL (HTTPS)</h1>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                    Setup Nginx sebagai reverse proxy dan Certbot untuk sertifikat SSL gratis agar
                    StudyNotes bisa diakses via HTTPS di domain custom.
                </p>
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> ~10 menit</span>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                        <ShieldCheck className="h-3 w-3 mr-1" /> HTTPS
                    </Badge>
                </div>
            </div>

            <AlertBlock type="info">
                Pastikan kamu sudah menyelesaikan panduan <Link href="/docs/vps" className="text-amber hover:underline">Deploy ke VPS</Link> dan StudyNotes sudah berjalan di port 3000.
            </AlertBlock>

            <section className="mb-12">
                <StepBlock number={1} title="Install Nginx & Certbot">
                    <CodeBlock filename="terminal" code={`apt install -y nginx certbot python3-certbot-nginx
systemctl enable nginx`} />
                </StepBlock>

                <StepBlock number={2} title="Buat Konfigurasi Nginx">
                    <CodeBlock filename="/etc/nginx/sites-available/studynotes" code={`server {
    listen 80;
    server_name domain-kamu.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # MinIO proxy (untuk akses file upload)
    location /storage/ {
        proxy_pass http://127.0.0.1:9000/;
        proxy_set_header Host $host;
    }

    client_max_body_size 50M;
}`} />
                    <AlertBlock type="warning">
                        Ganti <code className="text-amber">domain-kamu.com</code> dengan domain asli kamu.
                    </AlertBlock>
                </StepBlock>

                <StepBlock number={3} title="Aktifkan Konfigurasi">
                    <CodeBlock filename="terminal" code={`# Symlink ke sites-enabled
ln -s /etc/nginx/sites-available/studynotes /etc/nginx/sites-enabled/

# Hapus default (opsional)
rm /etc/nginx/sites-enabled/default

# Test konfigurasi
nginx -t

# Reload Nginx
systemctl reload nginx`} />
                </StepBlock>

                <StepBlock number={4} title="Generate Sertifikat SSL">
                    <CodeBlock filename="terminal" code={`certbot --nginx -d domain-kamu.com`} />
                    <p className="mt-2">Certbot akan otomatis:</p>
                    <ul className="list-disc list-inside text-sm space-y-1 mt-1">
                        <li>Generate sertifikat SSL gratis dari Let&apos;s Encrypt</li>
                        <li>Mengubah konfigurasi Nginx untuk HTTPS</li>
                        <li>Setup auto-renewal (setiap 90 hari)</li>
                    </ul>
                </StepBlock>

                <StepBlock number={5} title="Verifikasi">
                    <p>Buka browser dan akses:</p>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border my-3">
                        <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                        <code className="text-emerald-400 text-lg font-mono font-bold">https://domain-kamu.com</code>
                    </div>
                    <p>Kamu harus melihat ikon gembok 🔒 di address bar dan landing page StudyNotes tampil.</p>
                </StepBlock>
            </section>

            {/* Auto-renewal */}
            <section className="mb-12">
                <h2 className="font-serif text-2xl font-semibold mb-4">Auto-Renewal SSL</h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    Certbot secara otomatis memperpanjang sertifikat via systemd timer. Verifikasi:
                </p>
                <CodeBlock code={`# Cek timer auto-renewal
systemctl list-timers | grep certbot

# Test renewal (dry-run)
certbot renew --dry-run`} />
            </section>

            {/* Security headers */}
            <section className="mb-8">
                <h2 className="font-serif text-2xl font-semibold mb-4">Security Headers (Opsional)</h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    Tambahkan header keamanan di blok <code className="text-amber">server</code> Nginx:
                </p>
                <CodeBlock filename="nginx.conf" code={`# Tambahkan di dalam blok server { }
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;`} />
            </section>
        </article>
    )
}
