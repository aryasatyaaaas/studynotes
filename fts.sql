DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Note' AND column_name='search_vector') THEN
        ALTER TABLE "Note" ADD COLUMN search_vector tsvector
        GENERATED ALWAYS AS (
            to_tsvector('indonesian', coalesce(title, '') || ' ' || coalesce(content, ''))
        ) STORED;
        CREATE INDEX IF NOT EXISTS notes_fts_idx ON "Note" USING GIN(search_vector);
    END IF;
END
$$;
