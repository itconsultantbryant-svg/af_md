import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { json, error } from "@/lib/api";

export async function GET() {
  const session = await getSession();
  if (!session) return error("Unauthorized", 401);

  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId: session.id,
      status: "APPROVED",
      paymentStatus: "APPROVED",
    },
    include: {
      course: { select: { id: true, title: true, slug: true, level: true, duration: true, completionHours: true } },
      examAttempts: { select: { score: true, examType: true, passed: true, sectionId: true, createdAt: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return json({ enrollments });
}
