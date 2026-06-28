import path from "path";

/** Root directory for course uploads (Render persistent disk mounts here). */
export function getUploadsRoot(): string {
  const custom = process.env.UPLOAD_DIR;
  if (custom) return path.resolve(custom);
  return path.join(process.cwd(), "public", "uploads");
}

export function resolveUploadFile(segments: string[]): string {
  const uploadsRoot = getUploadsRoot();
  const filePath = path.join(uploadsRoot, ...segments);
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(path.resolve(uploadsRoot))) {
    throw new Error("Invalid upload path");
  }
  return resolved;
}
