import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { courseSchema } from "@/lib/validations";
import { parseCourseJson, slugify } from "@/lib/courses";
import { catalogForDisplay } from "@/lib/catalog";
import { syncCatalogCourses } from "@/lib/sync-courses";
import { json, error } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "true";

  try {
    const where = all ? {} : { published: true };
    let count = await prisma.course.count({ where });

    if (count === 0) {
      await syncCatalogCourses();
      count = await prisma.course.count({ where });
    }

    const courses = await prisma.course.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    if (courses.length === 0) {
      return json({ courses: catalogForDisplay(), source: "catalog" });
    }

    return json({ courses: courses.map(parseCourseJson), source: "database" });
  } catch (e) {
    console.error("GET /api/courses failed:", e);
    return json({ courses: catalogForDisplay(), source: "catalog" });
  }
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
