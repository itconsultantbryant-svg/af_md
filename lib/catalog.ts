import {
  courses as catalogCourses,
  audienceLabels,
  type Course as CatalogCourse,
  type CourseAudience,
} from "@/lib/data/training";
import { durationToHours } from "@/lib/learning";

export { catalogCourses, audienceLabels, type CourseAudience };

export function parsePrice(price: string): number {
  const n = parseFloat(price.replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : n;
}

export function defaultSeats(course: CatalogCourse): number {
  if (course.id === "youth-ai-camp") return 20;
  if (course.format === "Corporate") return 15;
  return 25;
}

/** Display shape used by the training page (works without a database). */
export interface TrainingCourseDisplay {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  level: "beginner" | "intermediate" | "advanced";
  format: string;
  price: string;
  topics: string[];
  audiences: CourseAudience[];
  seatsAvailable: number;
  seatsTotal: number;
  category?: string;
  certificate?: string;
}

export function catalogForDisplay(): TrainingCourseDisplay[] {
  return catalogCourses.map((course) => {
    const seats = defaultSeats(course);
    return {
      id: course.id,
      slug: course.id,
      title: course.title,
      description: course.description,
      duration: course.duration,
      level: course.level,
      format: course.format,
      price: course.price,
      topics: course.topics,
      audiences: course.audiences,
      seatsAvailable: seats,
      seatsTotal: seats,
      category: course.category ?? "specialized",
      certificate: course.certificate,
    };
  });
}

export function catalogCourseCount(): number {
  return catalogCourses.length;
}

/** Merge live API data (seats, DB id) onto the full static catalog. */
export function mergeApiWithCatalog(
  apiCourses: Array<Partial<TrainingCourseDisplay> & { slug?: string; id: string }>
): TrainingCourseDisplay[] {
  const apiBySlug = new Map(
    apiCourses.map((c) => [c.slug ?? c.id, c])
  );
  return catalogForDisplay().map((staticCourse) => {
    const live = apiBySlug.get(staticCourse.slug);
    if (!live) return staticCourse;
    return {
      ...staticCourse,
      id: live.id,
      seatsAvailable: live.seatsAvailable ?? staticCourse.seatsAvailable,
      seatsTotal: live.seatsTotal ?? staticCourse.seatsTotal,
      price: live.price ?? staticCourse.price,
    };
  });
}

export function upsertPayload(course: CatalogCourse) {
  const seats = defaultSeats(course);
  const completionHours = durationToHours(course.duration);
  const data = {
    title: course.title,
    description: course.description,
    duration: course.duration,
    completionHours,
    level: course.level,
    format: course.format,
    price: course.price,
    priceAmount: parsePrice(course.price),
    topics: JSON.stringify(course.topics),
    audiences: JSON.stringify(course.audiences),
    published: true,
  };
  return {
    seats,
    update: data,
    create: { slug: course.id, ...data, seatsTotal: seats, seatsAvailable: seats },
  };
}
