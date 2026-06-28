import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { courseSchema } from "@/lib/validations";
import { parseCourseJson, slugify } from "@/lib/courses";
import { json, error } from "@/lib/api";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "true";

  const courses = await prisma.course.findMany({
    where: all ? {} : { published: true },
    orderBy: { createdAt: "desc" },
  });

  return json({ courses: courses.map(parseCourseJson) });
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const data = courseSchema.parse(body);

    let slug = slugify(data.title);
    const existing = await prisma.course.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const course = await prisma.course.create({
      data: {
        slug,
        title: data.title,
        description: data.description,
        duration: data.duration,
        level: data.level,
        format: data.format,
        price: data.price,
        priceAmount: data.priceAmount,
        topics: JSON.stringify(data.topics),
        audiences: JSON.stringify(data.audiences),
        seatsTotal: data.seatsTotal,
        seatsAvailable: data.seatsAvailable,
        published: data.published ?? true,
      },
    });

    return json({ course: parseCourseJson(course) }, 201);
  } catch (e) {
    if (e instanceof Error && e.message === "Forbidden") return error("Forbidden", 403);
    if (e instanceof Error && e.message === "Unauthorized") return error("Unauthorized", 401);
    return error("Failed to create course", 500);
  }
}
