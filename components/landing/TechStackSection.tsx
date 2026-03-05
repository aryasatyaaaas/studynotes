import { Badge } from "@/components/ui/badge"

const techStack = [
    { name: "Next.js 16", emoji: "⚡" },
    { name: "TypeScript", emoji: "🔷" },
    { name: "React 19", emoji: "⚛️" },
    { name: "Tailwind CSS v4", emoji: "🎨" },
    { name: "shadcn/ui", emoji: "🧩" },
    { name: "Tiptap", emoji: "✍️" },
    { name: "PostgreSQL", emoji: "🐘" },
    { name: "Prisma ORM", emoji: "🔺" },
    { name: "Better Auth", emoji: "🔐" },
    { name: "Zod", emoji: "✅" },
    { name: "MinIO", emoji: "🗄️" },
    { name: "Ollama AI", emoji: "🤖" },
    { name: "Vercel AI SDK", emoji: "🌊" },
    { name: "Zustand", emoji: "🐻" },
    { name: "SWR", emoji: "📡" },
    { name: "React Hook Form", emoji: "📋" },
    { name: "use-debounce", emoji: "⏱️" },
    { name: "html2pdf.js", emoji: "📄" },
    { name: "Docker", emoji: "🐳" },
]

export function TechStackSection() {
    return (
        <section className="py-16 px-6 border-y border-border">
            <h3 className="font-serif text-xl text-center font-semibold">Dibangun dengan Teknologi Terbaik</h3>

            <div className="overflow-hidden relative mt-8">
                <div className="absolute left-0 inset-y-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 inset-y-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
                <div className="flex gap-3 animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused] w-max py-2">
                    {[...techStack, ...techStack].map((t, i) => (
                        <Badge key={`${t.name}-${i}`} variant="outline" className="px-4 py-2 text-sm border-border bg-muted/40 hover:border-amber/40 hover:scale-105 transition-all cursor-default whitespace-nowrap gap-1.5">
                            <span>{t.emoji}</span> {t.name}
                        </Badge>
                    ))}
                </div>
            </div>
        </section>
    )
}
