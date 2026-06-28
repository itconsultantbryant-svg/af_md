import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  getEnrollmentLearningState,
  recalculateEnrollmentProgress,
} from "@/lib/enrollment-progress";
import { gradeExam, parseQuestions } from "@/lib/learning";
import {
  canCompleteMaterial,
  parseProgress,
  type MaterialProgressData,
} from "@/lib/material-progress";
import { json, error } from "@/lib/api";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) return error("Unauthorized", 401);

  const state = await getEnrollmentLearningState(params.id, session.id);
  if (!state) return error("Enrollment not found or not active", 404);
  return json(state);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) return error("Unauthorized", 401);

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      id: params.id,
      userId: session.id,
      status: "APPROVED",
      paymentStatus: "APPROVED",
    },
  });
  if (!enrollment) return error("Not enrolled", 403);

  const body = await req.json();
  const { action } = body;

  if (action === "updateMaterialProgress") {
    const { materialId, progress, mediaDuration } = body as {
      materialId: string;
      progress: MaterialProgressData;
      mediaDuration?: number;
    };

    const material = await prisma.courseMaterial.findUnique({
      where: { id: materialId },
    });
    if (!material) return error("Material not found", 404);

    if (mediaDuration && !material.mediaDuration) {
      await prisma.courseMaterial.update({
        where: { id: materialId },
        data: { mediaDuration },
      });
    }

    await prisma.materialProgress.upsert({
      where: {
        enrollmentId_materialId: {
          enrollmentId: params.id,
          materialId,
        },
      },
      update: { progressJson: JSON.stringify(progress) },
      create: {
        enrollmentId: params.id,
        materialId,
        progressJson: JSON.stringify(progress),
      },
    });

    const updatedMaterial = await prisma.courseMaterial.findUnique({
      where: { id: materialId },
    });
    const savedProgress = parseProgress(
      (
        await prisma.materialProgress.findUnique({
          where: {
            enrollmentId_materialId: {
              enrollmentId: params.id,
              materialId,
            },
          },
        })
      )?.progressJson
    );
    const validation = canCompleteMaterial(
      updatedMaterial!.type,
      updatedMaterial!.pageCount,
      updatedMaterial!.mediaDuration,
      savedProgress
    );

    return json({
      material: {
        ...updatedMaterial,
        progress: savedProgress,
        canComplete: validation.allowed,
        completionHint: validation.reason,
      },
    });
  }

  if (action === "completeMaterial") {
    const { materialId } = body;
    const state = await getEnrollmentLearningState(params.id, session.id);
    const material = state?.sections
      .flatMap((s) => s.materials)
      .find((m) => m.id === materialId);

    if (!material?.unlocked) {
      return error("Complete previous materials first", 400);
    }

    if (!material.canComplete) {
      return error(material.completionHint || "Complete all viewing requirements first", 400);
    }

    await prisma.materialProgress.upsert({
      where: {
        enrollmentId_materialId: {
          enrollmentId: params.id,
          materialId,
        },
      },
      update: { completed: true, completedAt: new Date() },
      create: {
        enrollmentId: params.id,
        materialId,
        completed: true,
        completedAt: new Date(),
        progressJson: JSON.stringify(material.progress),
      },
    });

    await recalculateEnrollmentProgress(params.id);
    const updated = await getEnrollmentLearningState(params.id, session.id);
    return json({ state: updated });
  }

  if (action === "submitSectionExam") {
    const { sectionId, answers } = body;
    const section = await prisma.courseSection.findUnique({
      where: { id: sectionId },
      include: { exam: true, materials: true },
    });
    if (!section?.exam) return error("No exam for section", 404);

    const state = await getEnrollmentLearningState(params.id, session.id);
    const sectionState = state?.sections.find((s) => s.id === sectionId);
    if (!sectionState?.examUnlocked) {
      return error("Complete all materials before taking the exam", 400);
    }

    const questions = parseQuestions(section.exam.questions);
    const result = gradeExam(questions, answers, section.exam.passingScore);

    await prisma.examAttempt.create({
      data: {
        enrollmentId: params.id,
        examType: "SECTION",
        sectionId,
        score: result.score,
        passed: result.passed,
        answers: JSON.stringify(answers),
      },
    });

    await recalculateEnrollmentProgress(params.id);
    const updated = await getEnrollmentLearningState(params.id, session.id);
    return json({ ...result, state: updated });
  }

  if (action === "submitFinalExam") {
    const { answers } = body;
    const finalExam = await prisma.finalExam.findFirst({
      where: { courseId: enrollment.courseId },
    });
    if (!finalExam) return error("No final exam", 404);

    const state = await getEnrollmentLearningState(params.id, session.id);
    if (!state?.finalExam?.unlocked) {
      return error("Complete all sections before final exam", 400);
    }

    const questions = parseQuestions(finalExam.questions);
    const result = gradeExam(questions, answers, finalExam.passingScore);

    await prisma.examAttempt.create({
      data: {
        enrollmentId: params.id,
        examType: "FINAL",
        score: result.score,
        passed: result.passed,
        answers: JSON.stringify(answers),
      },
    });

    await recalculateEnrollmentProgress(params.id);
    const updated = await getEnrollmentLearningState(params.id, session.id);
    return json({ ...result, state: updated });
  }

  return error("Unknown action");
}
