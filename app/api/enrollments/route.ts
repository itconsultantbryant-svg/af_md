import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, requireAdmin } from "@/lib/auth";
import { enrollmentSchema } from "@/lib/validations";
import { sendEnrollmentConfirmation } from "@/lib/notifications";
import { resolveCourseByIdOrSlug } from "@/lib/sync-courses";
import { json, error } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return error("Unauthorized", 401);

    const { searchParams } = new URL(req.url);
    const mine = searchParams.get("mine") === "true";

    if (mine) {
      const enrollments = await prisma.enrollment.findMany({
        where: { userId: session.id },
        include: {
          course: true,
          user: { select: { firstName: true, lastName: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return json({ enrollments });
    }

    await requireAdmin();
    const enrollments = await prisma.enrollment.findMany({
      include: {
        course: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return json({ enrollments });
  } catch (e) {
    if (e instanceof Error && e.message === "Forbidden") return error("Forbidden", 403);
    return error("Failed to fetch enrollments", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return error("Please log in to enroll", 401);

    if (!session.emailVerified && !session.phoneVerified) {
      return error("Please verify your account before enrolling", 403);
    }

    const body = await req.json();
    const data = enrollmentSchema.parse(body);

    const course = await resolveCourseByIdOrSlug(data.courseId);
    if (!course || !course.published) return error("Course not found", 404);
    if (course.seatsAvailable <= 0) return error("No seats available", 400);

    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId: session.id, courseId: course.id },
      },
    });
    if (existing) return error("Already enrolled in this course", 409);

    const enrollment = await prisma.enrollment.create({
      data: {
        userId: session.id,
        courseId: course.id,
        organization: data.organization,
        jobTitle: data.jobTitle,
        experience: data.experience,
        motivation: data.motivation,
        emergencyContact: data.emergencyContact,
        paymentMethod: data.paymentMethod,
        paymentReference: data.paymentReference,
        paymentProof: data.paymentProof,
        status: "PENDING",
        paymentStatus: "PENDING",
      },
      include: { course: true },
    });

    await sendEnrollmentConfirmation(session.email, course.title);

    return json({ enrollment }, 201);
  } catch (e) {
    if (e instanceof Error && e.name === "ZodError") {
      return error("Invalid enrollment data");
    }
    return error("Enrollment failed", 500);
  }
}
