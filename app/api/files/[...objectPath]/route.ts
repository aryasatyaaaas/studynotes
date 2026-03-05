import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getPresignedUrl } from "@/lib/minio";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ objectPath: string[] }> }
) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { objectPath } = await params;
        const objectName = objectPath.map(decodeURIComponent).join('/');

        // Security check: ensure user can only access their own files
        // objectName is formatted as `userId/timestamp-filename`
        if (!objectName.startsWith(`${session.user.id}/`)) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const presignedUrl = await getPresignedUrl(objectName);
        return NextResponse.redirect(presignedUrl);
    } catch (error) {
        console.error("GET /api/files error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
