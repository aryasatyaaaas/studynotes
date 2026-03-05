# 📝 StudyNotes

A modern, production-ready note-taking web application for university students. Summarize lecture materials, organize by subject, and study smarter with AI.

## Tech Stack

- **Frontend**: Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS v4, Tiptap v3, Zustand, shadcn/ui
- **Backend**: Next.js Route Handlers, Prisma v6, PostgreSQL, Better Auth
- **AI**: Ollama (llama3.2) for local AI summarization
- **Storage**: MinIO (S3-compatible) for file uploads
- **Infrastructure**: Docker Compose

## Getting Started

### 1. Clone & Install

```bash
git clone <repo-url>
cd note-taker
cp .env.example .env
# Edit .env with your values
npm install
```

### 2. Start Infrastructure

```bash
docker compose up -d
```

This starts PostgreSQL, MinIO, and Ollama.

### 3. Pull AI Model

```bash
ollama pull llama3.2
```

### 4. Set Up Database

```bash
npx prisma migrate dev --name init
```

### 5. Run App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- ✅ Rich text editor (Tiptap) with auto-save
- ✅ Organize notes by subject/course
- ✅ Tag system with filtering
- ✅ Pin important notes
- ✅ Full-text search
- ✅ AI summarization via Ollama (Bahasa Indonesia)
- ✅ Upload images/files to MinIO
- ✅ Export notes to PDF
- ✅ Dark/Light mode
- ✅ Responsive mobile layout
- ✅ Loading skeletons

## License

MIT
