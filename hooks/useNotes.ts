"use client";

import useSWR from "swr";

interface Note {
    id: string;
    title: string;
    summary: string | null;
    isPinned: boolean;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    subject: { id: string; name: string; color: string; emoji: string | null } | null;
    attachments: { id: string; filename: string; url: string; size: number; mimeType: string }[];
}

interface UseNotesOptions {
    search?: string;
    tag?: string;
    subject?: string;
    pinned?: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch notes");
    return res.json();
});

export function useNotes(options: UseNotesOptions = {}) {
    const params = new URLSearchParams();
    if (options.search) params.set("search", options.search);
    if (options.tag) params.set("tag", options.tag);
    if (options.subject) params.set("subject", options.subject);
    if (options.pinned) params.set("pinned", "true");

    const query = params.toString();
    const url = query ? `/api/notes?${query}` : "/api/notes";

    const { data, error, isLoading, mutate } = useSWR<Note[]>(url, fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 5000,
    });

    return {
        notes: Array.isArray(data) ? data : [],
        loading: isLoading,
        error: error ? error.message : null,
        refetch: mutate
    };
}
