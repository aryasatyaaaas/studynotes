import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { streamText } from "ai";
import { createOllama } from "ollama-ai-provider";

const ollama = createOllama({
    baseURL: "http://127.0.0.1:11434/api",
});

const summarizeSchema = z.object({
    prompt: z.string().min(1, "Content is required"),
});

export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const parsed = summarizeSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const result = await streamText({
            // @ts-expect-error - version mismatch between ai core and provider
            model: ollama("llama3.2"),
            prompt: `You are an expert summarizer. Provide a concise, highly readable summary of the following notes. Use bullet points if applicable.\n\n${parsed.data.prompt}`,
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.error("POST /api/summarize error:", error);
        return NextResponse.json(
            { error: "Failed to generate summary. Ensure Ollama is running." },
            { status: 500 }
        );
    }
}
