/** Resolve stored file paths to the media API for correct MIME types and video streaming. */
export function resolveMediaUrl(fileUrl: string | null | undefined): string | null {
  if (!fileUrl) return null;
  if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) return fileUrl;
  if (fileUrl.startsWith("/uploads/")) return `/api/media${fileUrl}`;
  if (fileUrl.startsWith("uploads/")) return `/api/media/${fileUrl}`;
  return fileUrl.startsWith("/") ? fileUrl : `/${fileUrl}`;
}

export function mimeFromFilename(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  const map: Record<string, string> = {
    mp4: "video/mp4",
    webm: "video/webm",
    mov: "video/quicktime",
    m4v: "video/mp4",
    avi: "video/x-msvideo",
    mkv: "video/x-matroska",
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
  };
  return map[ext] || "application/octet-stream";
}

export function isVideoMime(mime: string, filename: string): boolean {
  if (mime.startsWith("video/")) return true;
  return /\.(mp4|webm|mov|m4v|avi|mkv)$/i.test(filename);
}
