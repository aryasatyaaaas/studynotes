import * as Minio from "minio";

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || "localhost",
    port: parseInt(process.env.MINIO_PORT || "9000"),
    useSSL: process.env.MINIO_USE_SSL === "true",
    accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
    secretKey: process.env.MINIO_SECRET_KEY || "minioadmin_secret",
});

const BUCKET_NAME = process.env.MINIO_BUCKET || "studynotes-uploads";

export async function ensureBucket(): Promise<void> {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
        await minioClient.makeBucket(BUCKET_NAME);
        // By default, newly created buckets in MinIO are private.
    }
}

export async function uploadFile(
    filename: string,
    buffer: Buffer,
    mimeType: string,
    userId: string
): Promise<{ url: string, objectName: string }> {
    await ensureBucket();
    const objectName = `${userId}/${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    await minioClient.putObject(BUCKET_NAME, objectName, buffer, buffer.length, {
        "Content-Type": mimeType,
    });

    return {
        url: `/api/files/${objectName}`,
        objectName
    };
}

export async function getPresignedUrl(objectName: string, expirySeconds = 3600): Promise<string> {
    return await minioClient.presignedGetObject(BUCKET_NAME, objectName, expirySeconds);
}

export { minioClient, BUCKET_NAME };
