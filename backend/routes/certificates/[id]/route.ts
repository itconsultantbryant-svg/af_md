import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { jsPDF } from "jspdf";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { error } from "@/lib/api";
import { COMPANY_NAME, COMPANY_TAGLINE, COMPANY_SHORT } from "@/lib/brand";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) return error("Unauthorized", 401);

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      id: params.id,
      userId: session.id,
      completed: true,
      certificateNumber: { not: null },
    },
    include: { course: true, user: true },
  });

  if (!enrollment) return error("Certificate not available", 404);

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Background
  doc.setFillColor(8, 14, 26);
  doc.rect(0, 0, w, h, "F");

  // Gold border
  doc.setDrawColor(212, 160, 23);
  doc.setLineWidth(2);
  doc.rect(10, 10, w - 20, h - 20);
  doc.setLineWidth(0.5);
  doc.rect(14, 14, w - 28, h - 28);

  try {
    const logoBuffer = await readFile(
      path.join(process.cwd(), "public", "afrimind_logo.png")
    );
    const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
    doc.addImage(logoBase64, "PNG", w / 2 - 28, 16, 56, 24);
  } catch {
    doc.setTextColor(212, 160, 23);
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`${COMPANY_SHORT.toUpperCase()} TECH&AI`, w / 2, 32, { align: "center" });
  }

  doc.setFontSize(36);
  doc.setFont("helvetica", "bold");
  doc.text("CERTIFICATE OF COMPLETION", w / 2, 52, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(136, 153, 187);
  doc.text("This is to certify that", w / 2, 62, { align: "center" });

  // Student name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  const studentName = `${enrollment.user.firstName} ${enrollment.user.lastName}`;
  doc.text(studentName, w / 2, 78, { align: "center" });

  // Gold underline
  doc.setDrawColor(212, 160, 23);
  doc.setLineWidth(0.8);
  const nameWidth = doc.getTextWidth(studentName);
  doc.line(w / 2 - nameWidth / 2 - 10, 82, w / 2 + nameWidth / 2 + 10, 82);

  doc.setTextColor(136, 153, 187);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("has successfully completed the course", w / 2, 94, { align: "center" });

  doc.setTextColor(212, 160, 23);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(enrollment.course.title, w / 2, 108, { align: "center" });

  doc.setTextColor(136, 153, 187);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Duration: ${enrollment.course.duration} · ${enrollment.course.completionHours} Hours · Level: ${enrollment.course.level}`,
    w / 2,
    118,
    { align: "center" }
  );

  if (enrollment.averageScore) {
    doc.text(`Final Average Score: ${enrollment.averageScore}%`, w / 2, 126, { align: "center" });
  }

  doc.text(`Certificate No: ${enrollment.certificateNumber}`, w / 2, 134, { align: "center" });
  doc.text(
    `Issued: ${enrollment.completedAt ? new Date(enrollment.completedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}`,
    w / 2,
    142,
    { align: "center" }
  );

  // Footer
  doc.setTextColor(212, 160, 23);
  doc.setFontSize(10);
  doc.text(`${COMPANY_NAME} — ${COMPANY_TAGLINE}`, w / 2, h - 28, { align: "center" });
  doc.setTextColor(136, 153, 187);
  doc.setFontSize(9);
  doc.text("Monrovia, Liberia · www.afrimindai.com", w / 2, h - 22, { align: "center" });

  // Signature lines
  doc.setDrawColor(136, 153, 187);
  doc.line(40, h - 45, 100, h - 45);
  doc.line(w - 100, h - 45, w - 40, h - 45);
  doc.setFontSize(8);
  doc.text("Program Director", 70, h - 40, { align: "center" });
  doc.text(COMPANY_SHORT, w - 70, h - 40, { align: "center" });

  const buf = Buffer.from(doc.output("arraybuffer"));
  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="certificate-${enrollment.certificateNumber}.pdf"`,
    },
  });
}
