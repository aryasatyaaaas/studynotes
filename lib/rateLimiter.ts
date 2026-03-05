const attempts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string, max = 5, windowMs = 15 * 60 * 1000): boolean {
    const now = Date.now();
    const entry = attempts.get(ip);

    if (!entry || now > entry.resetAt) {
        attempts.set(ip, { count: 1, resetAt: now + windowMs });
        return true;
    }

    if (entry.count >= max) return false;

    entry.count++;
    return true;
}

// Auto-cleanup expired entries every 10 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, val] of attempts.entries()) {
        if (now > val.resetAt) attempts.delete(key);
    }
}, 10 * 60 * 1000);
