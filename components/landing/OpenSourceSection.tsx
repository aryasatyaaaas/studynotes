import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Play, Github } from "lucide-react"

const commands = [
    "git clone https://github.com/aryasatyaaaas/studynotes",
    "cd studynotes && cp .env.example .env",
    "docker compose up -d",
    "npm install && npm run dev",
]

export function OpenSourceSection() {
    return (
        <section className="py-24 px-6 bg-muted/20">
            <div className="text-center mb-16 space-y-3">
                <Badge variant="outline" className="text-amber border-amber/30 rounded-full">✦ Open Source</Badge>
                <h2 className="font-serif text-4xl font-semibold">
                    Coba Sendiri, <em className="italic text-amber">Kontribusi</em> Bersama
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {/* Terminal card */}
                <Card className="border-border bg-card">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Play className="h-5 w-5 text-amber" />
                            <CardTitle className="font-serif">Jalankan Sekarang</CardTitle>
                        </div>
                        <CardDescription>Clone repo dan jalankan dengan Docker. Siap dalam hitungan menit.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-xl bg-[#0f1117] border border-white/5 p-4 font-mono text-sm space-y-1.5">
                            <div className="flex gap-1.5 mb-3">
                                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                            </div>
                            {commands.map(cmd => (
                                <div key={cmd} className="flex gap-2">
                                    <span className="text-[#27c93f] select-none">$</span>
                                    <span className="text-[#f5f0e8]">{cmd}</span>
                                </div>
                            ))}
                            <div className="text-[#27c93f] text-xs pt-1">✓ Ready on http://localhost:3000</div>
                        </div>
                    </CardContent>
                </Card>

                {/* GitHub card */}
                <Card className="border-border bg-card flex flex-col">
                    <CardHeader className="flex-1">
                        <Github className="h-8 w-8 mb-2" />
                        <CardTitle className="font-serif">Open Source & Berkembang</CardTitle>
                        <CardDescription className="leading-relaxed">
                            StudyNotes sedang aktif dikembangkan. Punya ide fitur, laporan bug, atau ingin berkontribusi?
                            Buka issue atau pull request di GitHub — semua welcome.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2 flex-wrap">
                            <Badge variant="outline" className="border-border gap-1">⭐ Star us</Badge>
                            <Badge variant="outline" className="border-border gap-1">🍴 Fork</Badge>
                            <Badge variant="outline" className="border-border gap-1">🐛 Issues</Badge>
                            <Badge variant="outline" className="border-border gap-1">💡 Discussions</Badge>
                        </div>
                        <Button variant="outline" className="w-full border-border hover:border-amber/40 gap-2">
                            <Github className="h-4 w-4" /> Lihat di GitHub →
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
