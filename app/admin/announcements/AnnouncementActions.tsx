"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"

export function AnnouncementActions() {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState("")
    const [message, setMessage] = useState("")
    const [type, setType] = useState("INFO")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await fetch("/api/admin/announcements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, message, type }),
            })
            setOpen(false)
            setTitle("")
            setMessage("")
            setType("INFO")
            router.refresh()
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-amber text-amber-foreground gap-2">
                    <Plus className="h-4 w-4" /> Buat Pengumuman
                </Button>
            </DialogTrigger>
            <DialogContent className="border-border bg-card">
                <DialogHeader>
                    <DialogTitle>Buat Pengumuman Baru</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Judul</Label>
                        <Input value={title} onChange={e => setTitle(e.target.value)} required className="border-border" placeholder="Judul pengumuman" />
                    </div>
                    <div>
                        <Label>Pesan</Label>
                        <textarea
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            required
                            rows={3}
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                            placeholder="Isi pengumuman..."
                        />
                    </div>
                    <div>
                        <Label>Tipe</Label>
                        <select
                            value={type}
                            onChange={e => setType(e.target.value)}
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                        >
                            <option value="INFO">Info</option>
                            <option value="WARNING">Warning</option>
                            <option value="SUCCESS">Success</option>
                            <option value="MAINTENANCE">Maintenance</option>
                        </select>
                    </div>
                    <Button type="submit" className="w-full bg-amber text-amber-foreground" disabled={loading}>
                        {loading ? "Membuat..." : "Buat Pengumuman"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
