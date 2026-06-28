import { prisma } from "@/lib/db";
import {
  computeCompletionPercent,
  generateCertificateNumber,
  parseQuestions,
} from "@/lib/learning";
import {
  canCompleteMaterial,
  parseProgress,
} from "@/lib/material-progress";

export async function recalculateEnrollmentProgress(enrollmentId: string) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      course: {
        include: {
          sections: {
            orderBy: { sortOrder: "asc" },
            include: {
              materials: { orderBy: { sortOrder: "asc" } },
              exam: true,
            },
          },
          finalExam: true,
        },
      },
      materialProgress: { where: { completed: true } },
      examAttempts: { where: { passed: true } },
    },
  });

  if (!enrollment) return null;

  const totalMaterials = enrollment.course.sections.reduce(
    (sum, s) => sum + s.materials.filter((m) => m.published).length,
    0
  );
  const completedMaterials = enrollment.materialProgress.length;
  const totalSections = enrollment.course.sections.filter((s) => s.exam).length;
  const passedSectionExams = enrollment.examAttempts.filter(
    (a) => a.examType === "SECTION"
  ).length;
  const finalExamPassed = enrollment.examAttempts.some(
    (a) => a.examType === "FINAL"
  );

  const completionPercent = computeCompletionPercent(
    totalMaterials,
    completedMaterials,
    totalSections,
    passedSectionExams,
    finalExamPassed
  );

  const allScores = await prisma.examAttempt.findMany({
    where: { enrollmentId },
    select: { score: true },
  });
  const averageScore =
    allScores.length > 0
      ? Math.round(
          allScores.reduce((s, a) => s + a.score, 0) / allScores.length
        )
      : null;

  const completed =
    completionPercent >= 100 &&
    finalExamPassed &&
    passedSectionExams >= totalSections &&
    completedMaterials >= totalMaterials;

  let certificateNumber = enrollment.certificateNumber;
  let certificateUrl = enrollment.certificateUrl;
  let completedAt = enrollment.completedAt;

  if (completed && !enrollment.completed) {
    certificateNumber = generateCertificateNumber();
    certificateUrl = `/api/certificates/${enrollmentId}`;
    completedAt = new Date();
  }

  return prisma.enrollment.update({
    where: { id: enrollmentId },
    data: {
      completionPercent,
      averageScore,
      completed,
      completedAt,
      certificateNumber,
      certificateUrl,
    },
  });
}

export async function getEnrollmentLearningState(enrollmentId: string, userId: string) {
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      id: enrollmentId,
      userId,
      status: "APPROVED",
      paymentStatus: "APPROVED",
    },
    include: {
      course: {
        include: {
          sections: {
            orderBy: { sortOrder: "asc" },
            include: {
              materials: { orderBy: { sortOrder: "asc" } },
              exam: true,
            },
          },
          finalExam: true,
        },
      },
      materialProgress: true,
      examAttempts: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!enrollment) return null;

  const completedMaterialIds = new Set(
    enrollment.materialProgress.filter((p) => p.completed).map((p) => p.materialId)
  );
  const passedSectionIds = new Set(
    enrollment.examAttempts
      .filter((a) => a.examType === "SECTION" && a.passed)
      .map((a) => a.sectionId)
  );

  const progressByMaterial = new Map(
    enrollment.materialProgress.map((p) => [p.materialId, p])
  );

  const sections = enrollment.course.sections.map((section, sectionIndex) => {
    const publishedMaterials = section.materials.filter((m) => m.published);

    const prevPublished =
      enrollment.course.sections[sectionIndex - 1]?.materials.filter((m) => m.published) || [];
    const sectionUnlocked =
      sectionIndex === 0 ||
      (enrollment.course.sections[sectionIndex - 1]?.exam
        ? passedSectionIds.has(enrollment.course.sections[sectionIndex - 1].id)
        : prevPublished.every((m) => completedMaterialIds.has(m.id)));

    const materials = publishedMaterials.map((material, matIndex) => {
      const prevMaterial = publishedMaterials[matIndex - 1];
      const materialUnlocked =
        sectionUnlocked &&
        (matIndex === 0 || completedMaterialIds.has(prevMaterial.id));

      const record = progressByMaterial.get(material.id);
      const progress = parseProgress(record?.progressJson);
      const validation = canCompleteMaterial(
        material.type,
        material.pageCount,
        material.mediaDuration,
        progress
      );

      return {
        ...material,
        completed: completedMaterialIds.has(material.id),
        unlocked: materialUnlocked,
        progress,
        canComplete: validation.allowed,
        completionHint: validation.reason,
      };
    });

    const allMaterialsDone = materials.every((m) => m.completed);
    const examPassed = section.exam ? passedSectionIds.has(section.id) : true;
    const examUnlocked = sectionUnlocked && allMaterialsDone && !!section.exam;

    const bestExamScore = section.exam
      ? enrollment.examAttempts
          .filter((a) => a.sectionId === section.id)
          .reduce((max, a) => Math.max(max, a.score), 0)
      : null;

    return {
      ...section,
      materials,
      unlocked: sectionUnlocked,
      allMaterialsDone,
      examPassed,
      examUnlocked,
      bestExamScore,
      exam: section.exam
        ? {
            ...section.exam,
            questions: parseQuestions(section.exam.questions),
          }
        : null,
    };
  });

  const allSectionsDone = sections.every((s) => s.examPassed);
  const finalExamPassed = enrollment.examAttempts.some(
    (a) => a.examType === "FINAL" && a.passed
  );
  const finalExamUnlocked = allSectionsDone && !!enrollment.course.finalExam;

  return {
    enrollment: {
      id: enrollment.id,
      completionPercent: enrollment.completionPercent,
      averageScore: enrollment.averageScore,
      completed: enrollment.completed,
      certificateNumber: enrollment.certificateNumber,
      certificateUrl: enrollment.certificateUrl,
      completedAt: enrollment.completedAt,
    },
    course: {
      id: enrollment.course.id,
      title: enrollment.course.title,
      description: enrollment.course.description,
      duration: enrollment.course.duration,
      completionHours: enrollment.course.completionHours,
      level: enrollment.course.level,
    },
    sections,
    finalExam: enrollment.course.finalExam
      ? {
          ...enrollment.course.finalExam,
          questions: parseQuestions(enrollment.course.finalExam.questions),
          unlocked: finalExamUnlocked,
          passed: finalExamPassed,
          bestScore: enrollment.examAttempts
            .filter((a) => a.examType === "FINAL")
            .reduce((max, a) => Math.max(max, a.score), 0),
        }
      : null,
  };
}
