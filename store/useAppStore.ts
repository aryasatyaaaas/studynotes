import { create } from "zustand";

interface AppState {
    // Theme
    theme: "dark" | "light";
    toggleTheme: () => void;
    setTheme: (theme: "dark" | "light") => void;

    // Sidebar
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    toggleSidebar: () => void;

    // Search
    searchQuery: string;
    setSearchQuery: (query: string) => void;

    // AI Panel
    aiPanelOpen: boolean;
    setAiPanelOpen: (open: boolean) => void;
    aiSummary: string;
    setAiSummary: (summary: string) => void;
    aiLoading: boolean;
    setAiLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
    // Theme — default dark
    theme: "dark",
    toggleTheme: () =>
        set((state) => {
            const newTheme = state.theme === "dark" ? "light" : "dark";
            if (typeof document !== "undefined") {
                document.documentElement.classList.toggle("dark", newTheme === "dark");
                localStorage.setItem("theme", newTheme);
            }
            return { theme: newTheme };
        }),
    setTheme: (theme) => {
        if (typeof document !== "undefined") {
            document.documentElement.classList.toggle("dark", theme === "dark");
            localStorage.setItem("theme", theme);
        }
        set({ theme });
    },

    // Sidebar
    sidebarOpen: true,
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

    // Search
    searchQuery: "",
    setSearchQuery: (query) => set({ searchQuery: query }),

    // AI Panel
    aiPanelOpen: false,
    setAiPanelOpen: (open) => set({ aiPanelOpen: open }),
    aiSummary: "",
    setAiSummary: (summary) => set({ aiSummary: summary }),
    aiLoading: false,
    setAiLoading: (loading) => set({ aiLoading: loading }),
}));
