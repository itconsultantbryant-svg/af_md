import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { json, error } from "@/lib/api";
import { processMaterialContent } from "@/lib/sync-course-exams";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        sections: {
          orderBy: { sortOrder: "asc" },
          include: {
            materials: { orderBy: { sortOrder: "asc" } },
            exam: true,
          },
        },
        finalExam: true,
      },
    });
    if (!course) return error("Course not found", 404);
    return json({ course });
  } catch {
    return error("Forbidden", 403);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { action } = body;

    if (action === "addSection") {
      const count = await prisma.courseSection.count({
        where: { courseId: params.id },
      });
      const section = await prisma.courseSection.create({
        data: {
          courseId: params.id,
          title: body.title || `Section ${count + 1}`,
          description: body.description,
          sortOrder: count,
        },
      });
      return json({ section }, 201);
    }

    if (action === "addMaterial") {
      const count = await prisma.courseMaterial.count({
        where: { sectionId: body.sectionId },
      });
      const material = await prisma.courseMaterial.create({
        data: {
          sectionId: body.sectionId,
          title: body.title,
          type: body.type,
          fileUrl: body.fileUrl,
          externalUrl: body.externalUrl,
          content: body.content,
          durationMinutes: body.durationMinutes || 15,
          sortOrder: count,
          published: body.published ?? false,
        },
      });
      try {
        await processMaterialContent(material.id);
      } catch (err) {
        console.error("Material processing error:", err);
      }
      const updated = await prisma.courseMaterial.findUnique({
        where: { id: material.id },
      });
      return json({ material: updated, examsGenerated: true }, 201);
    }

    if (action === "addSectionExam") {
      const exam = await prisma.sectionExam.upsert({
        where: { sectionId: body.sectionId },
        update: {
          title: body.title,
          questions: JSON.stringify(body.questions || []),
          passingScore: body.passingScore || 70,
        },
        create: {
          sectionId: body.sectionId,
          title: body.title || "Section Exam",
          questions: JSON.stringify(body.questions || []),
          passingScore: body.passingScore || 70,
        },
      });
      return json({ exam });
    }

    if (action === "addFinalExam") {
      const exam = await prisma.finalExam.upsert({
        where: { courseId: params.id },
        update: {
          title: body.title,
          questions: JSON.stringify(body.questions || []),
          passingScore: body.passingScore || 70,
        },
        create: {
          courseId: params.id,
          title: body.title || "Final Comprehensive Exam",
          questions: JSON.stringify(body.questions || []),
          passingScore: body.passingScore || 70,
        },
      });
      return json({ exam });
    }

    if (action === "updateHours") {
      await prisma.course.update({
        where: { id: params.id },
        data: { completionHours: body.completionHours },
      });
      return json({ success: true });
    }

    if (action === "publishMaterial") {
      await prisma.courseMaterial.update({
        where: { id: body.materialId },
        data: { published: true },
      });
      return json({ success: true });
    }

    if (action === "unpublishMaterial") {
      await prisma.courseMaterial.update({
        where: { id: body.materialId },
        data: { published: false },
      });
      return json({ success: true });
    }

    if (action === "regenerateExams") {
      const { processAllCourseMaterials } = await import("@/lib/sync-course-exams");
      await processAllCourseMaterials(params.id);
      return json({ success: true, message: "Exams regenerated from all materials" });
    }

    return error("Unknown action");
  } catch {
    return error("Failed", 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const itemId = searchParams.get("itemId");
    if (!itemId) return error("itemId required");

    if (type === "section") {
      await prisma.courseSection.delete({ where: { id: itemId } });
    } else if (type === "material") {
      await prisma.courseMaterial.delete({ where: { id: itemId } });
    }
    return json({ success: true });
  } catch {
    return error("Delete failed", 500);
  }
}
