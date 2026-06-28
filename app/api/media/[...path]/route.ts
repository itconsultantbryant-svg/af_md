import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";
import { mimeFromFilename } from "@/lib/media-url";
import { resolveUploadFile } from "@/lib/paths";

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const segments = params.path || [];
    if (!segments[0] || segments[0] !== "uploads") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const resolved = resolveUploadFile(segments.slice(1));

    const fileStat = await stat(resolved);
    const ext = path.extname(resolved);
    const contentType = mimeFromFilename(`file${ext}`);
    const fileSize = fileStat.size;

    const range = req.headers.get("range");
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      if (start >= fileSize || end >= fileSize) {
        return new NextResponse(null, { status: 416 });
      }
      const chunk = await readFile(resolved);
      const slice = chunk.subarray(start, end + 1);
      return new NextResponse(slice, {
        status: 206,
        headers: {
          "Content-Type": contentType,
          "Content-Length": String(slice.length),
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    const buffer = await readFile(resolved);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(fileSize),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
