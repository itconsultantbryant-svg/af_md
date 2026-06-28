import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { tryDeductSeat, tryRestoreSeat } from "@/lib/enrollment-service";
import { json, error } from "@/lib/api";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { status, paymentStatus, adminNotes } = body;

    const enrollment = await prisma.enrollment.findUnique({
      where: { id: params.id },
    });
    if (!enrollment) return error("Enrollment not found", 404);

    const updateData: Record<string, unknown> = {};
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    if (status) {
      updateData.status = status;
      if (status === "APPROVED") updateData.approvedAt = new Date();
      if (status === "REJECTED" && enrollment.seatDeducted) {
        await tryRestoreSeat(params.id);
      }
    }

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
      if (paymentStatus === "APPROVED") updateData.paymentApprovedAt = new Date();
      if (paymentStatus === "REJECTED" && enrollment.seatDeducted) {
        await tryRestoreSeat(params.id);
      }
    }

    const updated = await prisma.enrollment.update({
      where: { id: params.id },
      data: updateData,
      include: { course: true, user: true },
    });

    if (
      (status === "APPROVED" || updated.status === "APPROVED") &&
      (paymentStatus === "APPROVED" || updated.paymentStatus === "APPROVED")
    ) {
      const result = await tryDeductSeat(params.id);
      if (!result.deducted && result.reason === "No seats available") {
        return error("No seats available to confirm enrollment", 400);
      }
    }

    const final = await prisma.enrollment.findUnique({
      where: { id: params.id },
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
    });

    return json({ enrollment: final });
  } catch (e) {
    if (e instanceof Error && e.message === "Forbidden") return error("Forbidden", 403);
    return error("Update failed", 500);
  }
}
