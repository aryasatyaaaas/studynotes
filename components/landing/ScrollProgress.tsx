"use client"

import { useEffect, useState } from "react"

export function ScrollProgress() {
    const [width, setWidth] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY
            const docHeight = document.documentElement.scrollHeight - window.innerHeight
            setWidth(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
        }
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div className="fixed top-0 left-0 z-50 h-[3px] bg-amber transition-all duration-150" style={{ width: `${width}%` }} />
    )
}
