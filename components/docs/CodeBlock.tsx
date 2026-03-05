"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"

interface CodeBlockProps {
    code: string
    language?: string
    filename?: string
}

export function CodeBlock({ code, filename }: CodeBlockProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="rounded-xl border border-white/5 overflow-hidden my-4">
            {filename && (
                <div className="flex items-center justify-between px-4 py-2 bg-[#0f1117] border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                        </div>
                        <span className="text-xs text-[#6b7280] ml-2 font-mono">{filename}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 text-xs text-[#6b7280] hover:text-[#f5f0e8]">
                        {copied ? <><Check className="h-3 w-3 mr-1" /> Disalin!</> : <><Copy className="h-3 w-3 mr-1" /> Salin</>}
                    </Button>
                </div>
            )}

            <div className="relative bg-[#0f1117]">
                {!filename && (
                    <Button variant="ghost" size="sm" onClick={handleCopy}
                        className="absolute top-2 right-2 h-7 text-xs text-[#6b7280] hover:text-[#f5f0e8] z-10">
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                )}
                <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed text-[#f5f0e8]">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    )
}
