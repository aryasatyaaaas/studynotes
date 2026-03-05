"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function MobileNav() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const navItems = [
        { href: "/", label: "Dashboard", icon: "📊" },
        { href: "/notes", label: "All Notes", icon: "📝" },
        { href: "/notes/new", label: "New Note", icon: "✏️" },
        { href: "/subjects", label: "Subjects", icon: "📚" },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t border-border/50 px-2 py-2">
            <nav className="flex items-center justify-around">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                            pathname === item.href
                                ? "text-amber"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );
}
