export function StepBlock({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
    return (
        <div className="flex gap-5 my-8">
            <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-amber text-amber-foreground flex items-center justify-center font-serif font-bold text-lg shrink-0">
                    {number}
                </div>
                <div className="w-px flex-1 bg-border mt-3" />
            </div>
            <div className="flex-1 pb-8">
                <h3 className="font-serif text-xl font-semibold mb-3">{title}</h3>
                <div className="text-muted-foreground leading-relaxed space-y-3">{children}</div>
            </div>
        </div>
    )
}
