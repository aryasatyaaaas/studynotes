"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export function ThemeInitializer() {
    const setTheme = useAppStore((s) => s.setTheme);

    useEffect(() => {
        const stored = localStorage.getItem("theme") as "dark" | "light" | null;
        const preference = stored || "dark";
        setTheme(preference);
    }, [setTheme]);

    return null;
}
