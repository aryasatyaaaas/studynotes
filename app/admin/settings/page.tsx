"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, UserPlus, Wrench, Bot, Info } from "lucide-react"

export default function SettingsPage() {
    const router = useRouter()
    const [settings, setSettings] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState<string | null>(null)

    useEffect(() => {
        fetch("/api/admin/settings")
            .then(r => r.json())
            .then(data => { setSettings(data); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    const updateSetting = async (key: string, value: string) => {
        setSaving(key)
        await fetch("/api/admin/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key, value }),
        })
        setSettings(prev => ({ ...prev, [key]: value }))
        setSaving(null)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
                <Settings className="h-5 w-5 animate-spin mr-2" /> Memuat pengaturan...
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="font-serif text-3xl font-semibold flex items-center gap-3">
                    <Settings className="h-7 w-7 text-amber" /> Pengaturan
                </h1>
                <p className="text-muted-foreground mt-1">Konfigurasi aplikasi (Super Admin only)</p>
            </div>

            {/* Registration */}
            <Card className="border-border bg-card p-6">
                <h2 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-amber" /> Registrasi Pengguna
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-sm">Buka Registrasi</p>
                            <p className="text-xs text-muted-foreground">Izinkan pengguna baru mendaftar</p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateSetting("registrationOpen", settings.registrationOpen === "true" ? "false" : "true")}
                            className={`border-border ${settings.registrationOpen === "true" ? "text-emerald-400" : "text-rose-400"}`}
                            disabled={saving === "registrationOpen"}
                        >
                            {settings.registrationOpen === "true" ? "✓ Aktif" : "✗ Nonaktif"}
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Maintenance */}
            <Card className={`border p-6 ${settings.maintenanceMode === "true" ? "border-rose-500/40 bg-rose-500/5" : "border-border bg-card"}`}>
                <h2 className="font-serif text-lg font-semibold mb-1 flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-rose-400" /> Maintenance Mode
                </h2>
                <p className="text-xs text-muted-foreground mb-4">
                    Saat aktif, pengguna biasa tidak bisa akses aplikasi.
                </p>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-sm">Status Maintenance</p>
                        <p className="text-xs text-muted-foreground">
                            {settings.maintenanceMode === "true" ? "🔴 Aktif — pengguna tidak bisa akses" : "🟢 Nonaktif — normal"}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateSetting("maintenanceMode", settings.maintenanceMode === "true" ? "false" : "true")}
                        className={`border-border ${settings.maintenanceMode === "true" ? "text-rose-400" : "text-emerald-400"}`}
                        disabled={saving === "maintenanceMode"}
                    >
                        {settings.maintenanceMode === "true" ? "Matikan" : "Aktifkan"}
                    </Button>
                </div>
                {settings.maintenanceMode === "true" && (
                    <div className="mt-4">
                        <Label className="text-xs">Pesan untuk pengguna</Label>
                        <Input
                            defaultValue={settings.maintenanceMessage ?? ""}
                            placeholder="Kami sedang melakukan pembaruan..."
                            className="border-border mt-1"
                            onBlur={e => updateSetting("maintenanceMessage", e.target.value)}
                        />
                    </div>
                )}
            </Card>

            {/* AI Config */}
            <Card className="border-border bg-card p-6">
                <h2 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
                    <Bot className="h-5 w-5 text-amber" /> Konfigurasi AI
                </h2>
                <div className="space-y-3">
                    <div>
                        <Label className="text-xs">Model AI</Label>
                        <Input
                            defaultValue={settings.aiModel ?? "llama3.2"}
                            placeholder="llama3.2"
                            className="border-border mt-1"
                            onBlur={e => updateSetting("aiModel", e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">Contoh: llama3.2, llama3.2:1b, mistral</p>
                    </div>
                    <div>
                        <Label className="text-xs">Base URL</Label>
                        <Input
                            defaultValue={settings.aiBaseUrl ?? "http://localhost:11434"}
                            placeholder="http://localhost:11434"
                            className="border-border mt-1"
                            onBlur={e => updateSetting("aiBaseUrl", e.target.value)}
                        />
                    </div>
                </div>
            </Card>

            {/* App Info */}
            <Card className="border-border bg-card p-6">
                <h2 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
                    <Info className="h-5 w-5 text-amber" /> Informasi Aplikasi
                </h2>
                <dl className="space-y-3 text-sm">
                    {[
                        { label: "Versi", value: "1.0.0" },
                        { label: "Deployment Mode", value: process.env.NEXT_PUBLIC_DEPLOYMENT_MODE ?? "selfhost" },
                        { label: "App Name", value: process.env.NEXT_PUBLIC_APP_NAME ?? "StudyNotes" },
                    ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between">
                            <dt className="text-muted-foreground">{label}</dt>
                            <dd className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{value}</dd>
                        </div>
                    ))}
                </dl>
            </Card>
        </div>
    )
}
