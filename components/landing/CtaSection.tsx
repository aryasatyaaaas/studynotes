import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Github } from "lucide-react"

export function CtaSection() {
    return (
        <section className="py-32 px-6 relative overflow-hidden text-center">
            {/* Centered amber glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[700px] h-[300px] bg-amber/8 rounded-full blur-[80px]" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <Badge variant="outline" className="text-amber border-amber/30 rounded-full">✦ Siap Mulai?</Badge>
                <h2 className="font-serif text-5xl font-semibold leading-tight">
                    Mulai <em className="italic text-amber">Belajar Lebih Cerdas</em><br />Hari Ini
                </h2>
                <p className="text-muted-foreground text-lg">
                    Gratis. Open source. Tersedia di cloud atau self-host sesuai kebutuhanmu.
                </p>
                <div className="flex gap-3 justify-center flex-wrap pt-2">
                    <Button size="lg" asChild className="bg-amber text-amber-foreground shadow-[0_8px_32px_rgba(245,158,11,0.3)] hover:opacity-90 hover:-translate-y-0.5 transition-all gap-2">
                        <Link href="/register">
                            <Github className="h-4 w-4" /> Daftar Sekarang →
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="border-border hover:border-amber/40">
                        <Link href="/login">Sudah Punya Akun? Masuk</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
