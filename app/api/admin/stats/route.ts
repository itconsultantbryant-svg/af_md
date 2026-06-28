import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { json, error } from "@/lib/api";

export async function GET() {
  try {
    await requireAdmin();

    const [
      totalCourses,
      totalStudents,
      pendingEnrollments,
      pendingPayments,
      totalClients,
      activeContracts,
      subscriptions,
    ] = await Promise.all([
      prisma.course.count({ where: { published: true } }),
      prisma.user.count({ where: { role: "LEARNER" } }),
      prisma.enrollment.count({ where: { status: "PENDING" } }),
      prisma.enrollment.count({ where: { paymentStatus: "PENDING" } }),
      prisma.client.count(),
      prisma.contract.count({ where: { status: "ACTIVE" } }),
      prisma.newsletterSubscription.count({ where: { active: true } }),
    ]);

    return json({
      stats: {
        totalCourses,
        totalStudents,
        pendingEnrollments,
        pendingPayments,
        totalClients,
        activeContracts,
        subscriptions,
      },
    });
  } catch {
    return error("Forbidden", 403);
  }
}
