import { Wrench } from "lucide-react"

export default function MaintenancePage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                <div className="w-16 h-16 rounded-2xl bg-amber/15 flex items-center justify-center mx-auto mb-6">
                    <Wrench className="h-8 w-8 text-amber" />
                </div>
                <h1 className="font-serif text-3xl font-semibold mb-3">
                    Sedang Maintenance
                </h1>
                <p className="text-muted-foreground leading-relaxed mb-6">
                    Kami sedang melakukan pembaruan sistem. Silakan cek kembali dalam beberapa menit.
                </p>
                <div className="flex justify-center gap-3">
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:border-amber/40 transition-colors"
                    >
                        ← Kembali ke Beranda
                    </a>
                </div>
                <p className="text-xs text-muted-foreground mt-8">
                    Jika kamu admin, <a href="/login" className="text-amber hover:underline">login di sini</a>.
                </p>
            </div>
        </div>
    )
}
