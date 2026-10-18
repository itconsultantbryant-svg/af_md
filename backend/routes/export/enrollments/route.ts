import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { exportToExcel, exportToPdf, formatExportTimestamp } from "@/lib/export";
import { COMPANY_NAME } from "@/lib/brand";
import { error } from "@/lib/api";

const COLUMNS = [
  "Student Name",
  "Email",
  "Phone",
  "Course",
  "Enrollment Status",
  "Payment Status",
  "Payment Method",
  "Payment Reference",
  "Organization",
  "Registered At",
  "Approved At",
  "Payment Approved At",
];

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const format = new URL(req.url).searchParams.get("format") || "excel";

    const enrollments = await prisma.enrollment.findMany({
      include: {
        user: true,
        course: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const rows = enrollments.map((e) => ({
      "Student Name": `${e.user.firstName} ${e.user.lastName}`,
      Email: e.user.email,
      Phone: e.user.phone || "",
      Course: e.course.title,
      "Enrollment Status": e.status,
      "Payment Status": e.paymentStatus,
      "Payment Method": e.paymentMethod || "",
      "Payment Reference": e.paymentReference || "",
      Organization: e.organization || "",
      "Registered At": e.createdAt.toLocaleString(),
      "Approved At": e.approvedAt?.toLocaleString() || "",
      "Payment Approved At": e.paymentApprovedAt?.toLocaleString() || "",
    }));

    const timestamp = new Date().toISOString().slice(0, 10);

    if (format === "pdf") {
      const { buffer, filename, mime } = exportToPdf(
        rows,
        `${COMPANY_NAME} — Student Registrations (${formatExportTimestamp()})`,
        `enrollments-${timestamp}`,
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
      "Registrations",
      `enrollments-${timestamp}`
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
