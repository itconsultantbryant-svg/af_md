import { prisma } from "@/lib/db";
import { extractMaterialContent } from "@/lib/content-analyzer";
import { generateQuestionsFromContent, combineSectionQuestions } from "@/lib/exam-generator";
import type { ExamQuestion } from "@/lib/learning";

export async function processMaterialContent(materialId: string) {
  const material = await prisma.courseMaterial.findUnique({
    where: { id: materialId },
    include: { section: { select: { id: true, courseId: true, title: true } } },
  });
  if (!material) return null;

  try {
    const extracted = await extractMaterialContent(
      material.type,
      material.fileUrl,
      material.content,
      material.title
    );

    await prisma.courseMaterial.update({
      where: { id: materialId },
      data: {
        extractedText: extracted.text,
        pageCount: extracted.pageCount,
      },
    });
  } catch (err) {
    console.error(`Content extraction failed for ${materialId}:`, err);
    await prisma.courseMaterial.update({
      where: { id: materialId },
      data: {
        extractedText: material.content || material.title,
        pageCount: 1,
      },
    });
  }

  try {
    await regenerateSectionExam(material.sectionId);
  } catch (err) {
    console.error(`Exam regeneration failed for section ${material.sectionId}:`, err);
  }

  return prisma.courseMaterial.findUnique({ where: { id: materialId } });
}

export async function regenerateSectionExam(sectionId: string) {
  const section = await prisma.courseSection.findUnique({
    where: { id: sectionId },
    include: {
      materials: { orderBy: { sortOrder: "asc" } },
      course: { select: { id: true, title: true } },
    },
  });
  if (!section || section.materials.length === 0) return;

  const allQuestions: ExamQuestion[] = [];

  for (const material of section.materials) {
    const text =
      material.extractedText ||
      material.content ||
      `Learning material: ${material.title}. Type: ${material.type}.`;
    try {
      const qs = await generateQuestionsFromContent(text, material.title, 3);
      allQuestions.push(...qs);
    } catch (err) {
      console.error(`Question generation failed for ${material.id}:`, err);
    }
  }

  if (allQuestions.length === 0) return;

  const questions = allQuestions.map((q, i) => ({
    ...q,
    id: `sec-${sectionId.slice(0, 6)}-${i}`,
  }));

  await prisma.sectionExam.upsert({
    where: { sectionId },
    update: {
      title: `${section.title} Assessment`,
      questions: JSON.stringify(questions),
      passingScore: 70,
    },
    create: {
      sectionId,
      title: `${section.title} Assessment`,
      questions: JSON.stringify(questions),
      passingScore: 70,
    },
  });

  await regenerateFinalExam(section.course.id);
}

export async function regenerateFinalExam(courseId: string) {
  const sections = await prisma.courseSection.findMany({
    where: { courseId },
    orderBy: { sortOrder: "asc" },
    include: { exam: true },
  });

  const sectionQuestionSets: ExamQuestion[][] = [];
  for (const section of sections) {
    if (!section.exam?.questions) continue;
    try {
      const qs = JSON.parse(section.exam.questions) as ExamQuestion[];
      if (qs.length > 0) sectionQuestionSets.push(qs);
    } catch {
      /* skip */
    }
  }

  if (sectionQuestionSets.length === 0) return;

  const questions = combineSectionQuestions(sectionQuestionSets, 20);

  await prisma.finalExam.upsert({
    where: { courseId },
    update: {
      title: "Final Comprehensive Exam",
      questions: JSON.stringify(questions),
      passingScore: 70,
    },
    create: {
      courseId,
      title: "Final Comprehensive Exam",
      questions: JSON.stringify(questions),
      passingScore: 70,
    },
  });
}

export async function processAllCourseMaterials(courseId: string) {
  const sections = await prisma.courseSection.findMany({
    where: { courseId },
    include: { materials: true },
  });

  for (const section of sections) {
    for (const material of section.materials) {
      await processMaterialContent(material.id);
    }
  }
}
