import type { Course } from "@prisma/client";

export type CourseAudience =
  | "students"
  | "professionals"
  | "companies"
  | "ngos"
  | "public";

export const audienceLabels: Record<CourseAudience, string> = {
  students: "Students",
  professionals: "Professionals",
  companies: "Companies",
  ngos: "NGOs",
  public: "General Public",
};

export function parseCourseJson(course: Course) {
  return {
    ...course,
    topics: JSON.parse(course.topics) as string[],
    audiences: JSON.parse(course.audiences) as CourseAudience[],
  };
}

export function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
