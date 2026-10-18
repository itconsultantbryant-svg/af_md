import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { json, error } from "@/lib/api";

export async function GET() {
  try {
    await requireAdmin();
    const students = await prisma.user.findMany({
      where: { role: "LEARNER" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        emailVerified: true,
        phoneVerified: true,
        createdAt: true,
        enrollments: {
          include: { course: { select: { title: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return json({ students });
  } catch {
    return error("Forbidden", 403);
  }
}
