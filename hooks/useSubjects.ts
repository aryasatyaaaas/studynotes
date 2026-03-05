"use client";

import useSWR from "swr";

interface Subject {
    id: string;
    name: string;
    color: string;
    emoji: string | null;
    _count?: { notes: number };
}

const fetcher = (url: string) => fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch subjects");
    return res.json();
});

export function useSubjects() {
    const { data, error, isLoading, mutate } = useSWR<Subject[]>("/api/subjects", fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 5000,
    });

    return {
        subjects: Array.isArray(data) ? data : [],
        loading: isLoading,
        error: error ? error.message : null,
        refetch: mutate
    };
}
