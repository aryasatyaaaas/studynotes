import { Code2, Server, ShieldCheck } from "lucide-react"

const highlights = [
    { icon: Code2, label: "100% Open Source", desc: "Source code terbuka, bebas dimodifikasi" },
    { icon: Server, label: "Self-Hosted", desc: "Kamu yang pegang kendali penuh atas aplikasi" },
    { icon: ShieldCheck, label: "Zero Vendor Lock-in", desc: "Tidak bergantung pada layanan pihak ketiga" },
]

export function HighlightBar() {
    return (
        <div className="border-y border-border bg-muted/30 py-6 px-6">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                {highlights.map(({ icon: Icon, label, desc }) => (
                    <div key={label} className="flex items-center gap-3 justify-center md:justify-start">
                        <div className="w-9 h-9 rounded-lg bg-amber/10 flex items-center justify-center shrink-0">
                            <Icon className="h-4 w-4 text-amber" />
                        </div>
                        <div>
                            <p className="font-medium text-sm text-foreground">{label}</p>
                            <p className="text-xs text-muted-foreground">{desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
