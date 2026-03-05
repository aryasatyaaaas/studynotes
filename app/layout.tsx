import type { Metadata } from "next";
import "./globals.css";
import { ThemeInitializer } from "@/components/layout/ThemeInitializer";

export const metadata: Metadata = {
  title: "StudyNotes — Smart Note Taking for Students",
  description:
    "A modern note-taking app for university students. Summarize lectures, organize by subject, and study smarter with AI.",
  keywords: ["notes", "study", "university", "lecture", "AI", "summarize"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeInitializer />
        {children}
      </body>
    </html>
  );
}
