import { prisma } from './lib/prisma';

async function main() {
    try {
        console.log("Checking if search_vector column exists...");

        // Wait, in postgres, to check if a column exists and add it gracefully
        await prisma.$executeRawUnsafe(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Note' AND column_name='search_vector') THEN
                    ALTER TABLE "Note" ADD COLUMN search_vector tsvector
                    GENERATED ALWAYS AS (
                        to_tsvector('indonesian', coalesce(title, '') || ' ' || coalesce(content, ''))
                    ) STORED;
                END IF;
            END
            $$;
        `);

        console.log("Creating FTS index if it doesn't exist...");
        await prisma.$executeRawUnsafe(`
            CREATE INDEX IF NOT EXISTS notes_fts_idx ON "Note" USING GIN(search_vector);
        `);

        console.log("FTS setup complete!");
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
