import { NextRequest } from "next/server";
import path from "path";
import { requireAdmin } from "@/lib/auth";
import { json, error } from "@/lib/api";
import { mimeFromFilename } from "@/lib/media-url";
import { putUpload } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || file.size === 0) return error("A logo image is required");
    if (file.size > 5 * 1024 * 1024) {
      return error("Logo must be 5 MB or smaller");
    }

    const filename = file.name || "logo";
    const mime = file.type || mimeFromFilename(filename);
    if (!mime.startsWith("image/")) {
      return error("Logo must be an image file");
    }

    const ext = path.extname(filename) || ".png";
    const storedName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const fileUrl = `/uploads/portfolio/${storedName}`;
    await putUpload(fileUrl, Buffer.from(await file.arrayBuffer()), mime);

    return json({ logoUrl: fileUrl }, 201);
  } catch (e) {
    console.error("Portfolio logo upload failed:", e);
    if (e instanceof Error && e.message === "Forbidden") return error("Forbidden", 403);
    return error("Logo upload failed", 500);
  }
}
