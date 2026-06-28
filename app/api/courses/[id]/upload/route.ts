import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { json, error } from "@/lib/api";
import { processMaterialContent } from "@/lib/sync-course-exams";
import { isVideoMime, mimeFromFilename } from "@/lib/media-url";
import { getUploadsRoot } from "@/lib/paths";

function inferType(filename: string, mime: string): string {
  if (isVideoMime(mime, filename)) return "VIDEO";
  if (mime.includes("pdf") || filename.endsWith(".pdf")) return "PDF";
  if (mime.includes("word") || filename.match(/\.docx?$/i)) return "DOC";
  if (mime.startsWith("image/")) return "IMAGE";
  return "PDF";
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const sectionId = formData.get("sectionId") as string;
    const title = formData.get("title") as string;
    let type = (formData.get("type") as string) || "PDF";
    const durationMinutes = parseInt(
      (formData.get("durationMinutes") as string) || "15"
    );
    const content = (formData.get("content") as string) || null;
    const publish = formData.get("publish") === "true";

    if (!sectionId || !title) {
      return error("sectionId and title required");
    }

    if (!file || file.size === 0) {
      return error("A file is required for upload");
    }

    const filename = file.name || "upload";
    const mime = file.type || mimeFromFilename(filename);
    type = inferType(filename, mime);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = path.extname(filename) || (type === "VIDEO" ? ".mp4" : ".bin");
    const storedName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const uploadDir = path.join(getUploadsRoot(), "courses", params.id);
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, storedName), buffer);
    const fileUrl = `/uploads/courses/${params.id}/${storedName}`;

    const count = await prisma.courseMaterial.count({ where: { sectionId } });
    const material = await prisma.courseMaterial.create({
      data: {
        sectionId,
        title,
        type,
        fileUrl,
        content,
        mimeType: mime,
        durationMinutes,
        sortOrder: count,
        published: publish,
      },
    });

    let processingError: string | null = null;
    try {
      await processMaterialContent(material.id);
    } catch (err) {
      processingError = err instanceof Error ? err.message : "Processing failed";
      console.error("Material processing error:", err);
    }

    const updated = await prisma.courseMaterial.findUnique({
      where: { id: material.id },
      include: {
        section: {
          include: { exam: true, course: { include: { finalExam: true } } },
        },
      },
    });

    const sectionExamCount = updated?.section?.exam?.questions
      ? JSON.parse(updated.section.exam.questions).length
      : 0;
    const finalExamCount = updated?.section?.course?.finalExam?.questions
      ? JSON.parse(updated.section.course.finalExam.questions).length
      : 0;

    return json(
      {
        material: updated,
        examsGenerated: sectionExamCount > 0,
        sectionExamCount,
        finalExamCount,
        processingError,
        previewUrl: `/api/media${fileUrl}`,
      },
      201
    );
  } catch (e) {
    console.error("Upload failed:", e);
    if (e instanceof Error && e.message === "Forbidden") return error("Forbidden", 403);
    return error(e instanceof Error ? e.message : "Upload failed", 500);
  }
}
