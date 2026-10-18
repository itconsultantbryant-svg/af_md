import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { courseSchema } from "@/lib/validations";
import { parseCourseJson } from "@/lib/courses";
import { json, error } from "@/lib/api";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const course = await prisma.course.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }] },
  });
  if (!course) return error("Course not found", 404);
  return json({ course: parseCourseJson(course) });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const body = await req.json();
    const data = courseSchema.partial().parse(body);

    const existing = await prisma.course.findUnique({ where: { id: params.id } });
    if (!existing) return error("Course not found", 404);

    const enrolled = existing.seatsTotal - existing.seatsAvailable;
    const newTotal = data.seatsTotal ?? existing.seatsTotal;
    const newAvailable =
      data.seatsAvailable !== undefined
        ? data.seatsAvailable
        : Math.max(0, newTotal - enrolled);

    const course = await prisma.course.update({
      where: { id: params.id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(data.duration && { duration: data.duration }),
        ...(data.level && { level: data.level }),
        ...(data.format && { format: data.format }),
        ...(data.price && { price: data.price }),
        ...(data.priceAmount !== undefined && { priceAmount: data.priceAmount }),
        ...(data.topics && { topics: JSON.stringify(data.topics) }),
        ...(data.audiences && { audiences: JSON.stringify(data.audiences) }),
        seatsTotal: newTotal,
        seatsAvailable: newAvailable,
        ...(data.published !== undefined && { published: data.published }),
      },
    });

    return json({ course: parseCourseJson(course) });
  } catch (e) {
    if (e instanceof Error && e.message === "Forbidden") return error("Forbidden", 403);
    return error("Failed to update course", 500);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    await prisma.course.delete({ where: { id: params.id } });
    return json({ success: true });
  } catch {
    return error("Failed to delete course", 500);
  }
}
