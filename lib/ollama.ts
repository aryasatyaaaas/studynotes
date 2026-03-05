const OLLAMA_BASE_URL =
    process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2";

function sanitizeForPrompt(text: string): string {
    return text
        .replace(/ignore (previous|all) instructions/gi, '[redacted]')
        .replace(/system prompt/gi, '[redacted]')
        .slice(0, 50_000); // hard cap 50K chars to Ollama
}

export async function summarizeWithOllama(content: string): Promise<string> {
    const sanitizedContent = sanitizeForPrompt(content);
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: OLLAMA_MODEL,
            prompt: `Kamu adalah asisten akademik. Rangkum materi kuliah berikut dalam Bahasa Indonesia secara terstruktur dengan poin-poin utama, konsep kunci, dan kesimpulan. Materi:\n\n${sanitizedContent}`,
            stream: false,
        }),
        signal: AbortSignal.timeout(60000), // 60s timeout
    });

    if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
}
