import { prisma } from "@/lib/db";

/** Deduct seat when both enrollment and payment are approved */
export async function tryDeductSeat(enrollmentId: string) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: { course: true },
  });

  if (!enrollment) return { deducted: false, reason: "Not found" };
  if (enrollment.seatDeducted) return { deducted: false, reason: "Already deducted" };
  if (enrollment.status !== "APPROVED" || enrollment.paymentStatus !== "APPROVED") {
    return { deducted: false, reason: "Pending approvals" };
  }
  if (enrollment.course.seatsAvailable <= 0) {
    return { deducted: false, reason: "No seats available" };
  }

  await prisma.$transaction([
    prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { seatDeducted: true },
    }),
    prisma.course.update({
      where: { id: enrollment.courseId },
      data: { seatsAvailable: { decrement: 1 } },
    }),
  ]);

  return { deducted: true };
}

/** Restore seat if enrollment rejected after deduction */
export async function tryRestoreSeat(enrollmentId: string) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
  });
  if (!enrollment?.seatDeducted) return;

  await prisma.$transaction([
    prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { seatDeducted: false },
    }),
    prisma.course.update({
      where: { id: enrollment.courseId },
      data: { seatsAvailable: { increment: 1 } },
    }),
  ]);
}
