import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { exportToExcel, exportToPdf, formatExportTimestamp } from "@/lib/export";
import { COMPANY_NAME } from "@/lib/brand";
import { error } from "@/lib/api";

const COLUMNS = [
  "Student Name",
  "Email",
  "Course",
  "Amount",
  "Payment Method",
  "Payment Reference",
  "Payment Status",
  "Enrollment Status",
  "Submitted At",
  "Payment Approved At",
];

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const format = new URL(req.url).searchParams.get("format") || "excel";

    const enrollments = await prisma.enrollment.findMany({
      where: { paymentMethod: { not: null } },
      include: { user: true, course: true },
      orderBy: { createdAt: "desc" },
    });

    const rows = enrollments.map((e) => ({
      "Student Name": `${e.user.firstName} ${e.user.lastName}`,
      Email: e.user.email,
      Course: e.course.title,
      Amount: e.course.price,
      "Payment Method": e.paymentMethod || "",
      "Payment Reference": e.paymentReference || "",
      "Payment Status": e.paymentStatus,
      "Enrollment Status": e.status,
      "Submitted At": e.createdAt.toLocaleString(),
      "Payment Approved At": e.paymentApprovedAt?.toLocaleString() || "Pending",
    }));

    const timestamp = new Date().toISOString().slice(0, 10);

    if (format === "pdf") {
      const { buffer, filename, mime } = exportToPdf(
        rows,
        `${COMPANY_NAME} — Payment Records (${formatExportTimestamp()})`,
        `payments-${timestamp}`,
        COLUMNS
      );
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": mime,
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    const { buffer, filename, mime } = exportToExcel(
      rows,
      "Payments",
      `payments-${timestamp}`
    );
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mime,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch {
    return error("Export failed", 500);
  }
}
