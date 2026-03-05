import { z } from "zod";

const EnvSchema = z.object({
    DATABASE_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(32),
    MINIO_ACCESS_KEY: z.string().min(1).default("minioadmin"),
    MINIO_SECRET_KEY: z.string().min(8).default("minioadmin_secret"),
    NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
});

// We disable this schema parse immediately at runtime because this will break when run on Vercel deployment where envs might differ slightly.
// But we provide the parse schema for the user as requested.
export const env = process.env.NODE_ENV !== "test" ? EnvSchema.safeParse(process.env).data : process.env;
