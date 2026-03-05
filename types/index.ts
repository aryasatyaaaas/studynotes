import { Note, Subject, Attachment } from "@/generated/prisma/client";

// Extended types with relations
export type NoteWithRelations = Note & {
    subject: Subject | null;
    attachments: Attachment[];
};

export type SubjectWithNotes = Subject & {
    notes: Note[];
    _count?: {
        notes: number;
    };
};

// API Request/Response types
export interface CreateNoteInput {
    title: string;
    content: string;
    subjectId?: string;
    tags?: string[];
}

export interface UpdateNoteInput {
    title?: string;
    content?: string;
    subjectId?: string | null;
    tags?: string[];
    isPinned?: boolean;
    summary?: string;
}

export interface CreateSubjectInput {
    name: string;
    color?: string;
    emoji?: string;
}

export interface UpdateSubjectInput {
    name?: string;
    color?: string;
    emoji?: string;
}

export interface SummarizeInput {
    content: string;
}

export interface SummarizeResponse {
    summary: string;
}

export interface UploadResponse {
    url: string;
    filename: string;
    size: number;
    mimeType: string;
}

export interface ApiError {
    error: string;
    details?: string;
}

// Filter types
export interface NoteFilters {
    subject?: string;
    tag?: string;
    search?: string;
    pinned?: string;
}
