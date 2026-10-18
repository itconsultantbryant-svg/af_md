import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

let client: S3Client | undefined;
function storage() {
  if (!process.env.AWS_ENDPOINT_URL_S3) throw new Error("Neon Object Storage is not configured");
  return client ??= new S3Client({ forcePathStyle: true, endpoint: process.env.AWS_ENDPOINT_URL_S3,
    requestChecksumCalculation: "WHEN_REQUIRED", responseChecksumValidation: "WHEN_REQUIRED" });
}

export function uploadKey(fileUrl: string): string {
  if (!fileUrl.startsWith("/uploads/")) throw new Error("Invalid upload URL");
  const key = fileUrl.slice("/uploads/".length);
  if (!key || key.split("/").some(part => !part || part === "." || part === ".." || part.includes("\\"))) {
    throw new Error("Invalid upload path");
  }
  return key;
}

export async function putUpload(fileUrl: string, body: Buffer, contentType: string) {
  await storage().send(new PutObjectCommand({
    Bucket: "course-uploads", Key: uploadKey(fileUrl), Body: body, ContentType: contentType,
  }));
}

export function getUpload(fileUrl: string, range?: string) {
  return storage().send(new GetObjectCommand({
    Bucket: "course-uploads", Key: uploadKey(fileUrl), ...(range ? { Range: range } : {}),
  }));
}

export async function readUpload(fileUrl: string): Promise<Buffer> {
  const object = await getUpload(fileUrl);
  if (!object.Body) throw new Error("Empty object response");
  return Buffer.from(await object.Body.transformToByteArray());
}
