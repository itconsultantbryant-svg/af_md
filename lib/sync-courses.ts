import { prisma } from "@/lib/db";
import { catalogCourses, upsertPayload } from "@/lib/catalog";

/** Upsert all static catalog courses into PostgreSQL (idempotent). */
export async function syncCatalogCourses(): Promise<number> {
  for (const course of catalogCourses) {
    const { update, create } = upsertPayload(course);
    await prisma.course.upsert({
      where: { slug: course.id },
      update,
      create,
    });
  }
  return catalogCourses.length;
}

/** Resolve course by Prisma id or catalog slug. Syncs catalog if missing. */
export async function resolveCourseByIdOrSlug(courseId: string) {
  let course = await prisma.course.findUnique({ where: { id: courseId } });
  if (course) return course;

  course = await prisma.course.findUnique({ where: { slug: courseId } });
  if (course) return course;

  await syncCatalogCourses();
  return prisma.course.findUnique({ where: { slug: courseId } });
}
