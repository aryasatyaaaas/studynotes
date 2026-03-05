import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { uploadFile } from "@/lib/minio";

export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Max 5MB
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
        }

        const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
        if (!allowedMimeTypes.includes(file.type)) {
            return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Basic magic byte validation header check
        const hexHeader = buffer.subarray(0, 4).toString('hex').toUpperCase();
        let isValidMagicNumber = false;

        if (file.type === "image/jpeg" && hexHeader.startsWith("FFD8FF")) isValidMagicNumber = true;
        if (file.type === "image/png" && hexHeader === "89504E47") isValidMagicNumber = true;
        if (file.type === "image/webp" && hexHeader === "52494646") isValidMagicNumber = true;
        if (file.type === "image/gif" && (hexHeader === "47494638")) isValidMagicNumber = true; // GIF8
        if (file.type === "application/pdf" && hexHeader === "25504446") isValidMagicNumber = true;

        if (!isValidMagicNumber) {
            return NextResponse.json({ error: "Invalid file content" }, { status: 400 });
        }
        const { url, objectName } = await uploadFile(file.name, buffer, file.type, session.user.id);

        return NextResponse.json({
            url,
            filename: file.name,
            size: file.size,
            mimeType: file.type,
        });
    } catch (error) {
        console.error("POST /api/upload error:", error);
        return NextResponse.json(
            { error: "Upload failed" },
            { status: 500 }
        );
    }
}
