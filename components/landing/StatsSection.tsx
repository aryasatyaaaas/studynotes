"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { useReveal } from "@/hooks/useReveal"

const stats = [
    { value: 100, suffix: "%", label: "Gratis & Open Source" },
    { value: 2, suffix: "", label: "Mode deploy: Cloud & Self-Host" },
    { value: 2, prefix: "<", suffix: "s", label: "Auto-save interval" },
    { value: 11, suffix: "+", label: "Fitur utama siap pakai" },
]

function CountUp({ target, prefix, suffix }: { target: number; prefix?: string; suffix?: string }) {
    const [count, setCount] = useState(0)
    const ref = useRef<HTMLDivElement>(null)
    const started = useRef(false)

    const animate = useCallback(() => {
        if (target === 0) { setCount(0); return }
        const duration = 1500
        const start = performance.now()
        const step = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.round(eased * target))
            if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
    }, [target])

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting && !started.current) {
                started.current = true
                animate()
                obs.disconnect()
            }
        }, { threshold: 0.3 })
        if (ref.current) obs.observe(ref.current)
        return () => obs.disconnect()
    }, [animate])

    return (
        <span ref={ref} className="tabular-nums">
            {prefix}{count}{suffix}
        </span>
    )
}

export function StatsSection() {
    const { ref, visible } = useReveal()

    return (
        <section ref={ref} className={`py-24 px-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {stats.map((stat, i) => (
                    <Card key={stat.label} className="text-center border-border bg-card p-8 hover:shadow-[0_8px_32px_rgba(245,158,11,0.10)] transition-shadow group" style={{ transitionDelay: `${i * 100}ms` }}>
                        <p className="font-serif text-5xl font-black text-amber">
                            <CountUp target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                        </p>
                        <p className="text-muted-foreground text-sm mt-2 leading-snug">{stat.label}</p>
                    </Card>
                ))}
            </div>
        </section>
    )
}
